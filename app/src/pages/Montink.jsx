import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ActionsPanel from '../components/montink/ActionsPanel';
import FilterPanel from '../components/montink/FilterPanel';
import OrdersTable from '../components/montink/OrdersTable';
import OrderActionsBar from '../components/montink/OrderActionsBar';
import OrderDetailsModal from '../components/montink/OrderDetailsModal';
import ChangeStatusModal from '../components/montink/ChangeStatusModal';
import montinkService from '../services/montinkService';

/**
 * Página principal da Montink - Gerenciamento de pedidos
 */
function Montink() {
  const { user, hasPermission } = useAuth();
  
  // Estados principais
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Estados de filtros
  const [activeFilters, setActiveFilters] = useState({});
  
  // Estados de modais
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalData, setStatusModalData] = useState(null);

  // Verifica permissões
  useEffect(() => {
    if (!hasPermission('montik')) {
      setError('Você não tem permissão para acessar esta página');
      return;
    }
  }, [hasPermission]);

  // Carrega dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Carrega pedidos quando filtros ou página mudam
  useEffect(() => {
    if (Object.keys(activeFilters).length > 0 || currentPage > 1) {
      loadOrders();
    }
  }, [activeFilters, currentPage]);

  /**
   * Carrega dados iniciais (status e pedidos)
   */
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carrega status e pedidos em paralelo
      const [statusResponse, ordersResponse] = await Promise.all([
        montinkService.getStatusOptions(),
        montinkService.getPedidos({}, 1, 15)
      ]);
        setStatusOptions(statusResponse);
      setOrders(ordersResponse.pedidos || []);
      setTotalPages(ordersResponse.paginacao?.totalPaginas || 1);
      setTotalOrders(ordersResponse.paginacao?.totalPedidos || 0);
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega pedidos com filtros aplicados
   */
  const loadOrders = async () => {
    try {
      setLoading(true);
      
      const response = await montinkService.getPedidos(
        activeFilters, 
        currentPage, 
        15
      );
        setOrders(response.pedidos || []);
      setTotalPages(response.paginacao?.totalPaginas || 1);
      setTotalOrders(response.paginacao?.totalPedidos || 0);
      
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError('Erro ao carregar pedidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aplica filtros aos pedidos
   */
  const handleFilter = useCallback((filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    setSelectedOrders([]);
  }, []);

  /**
   * Manipula seleção de pedidos
   */
  const handleSelectOrders = useCallback((orderIds) => {
    setSelectedOrders(orderIds);
  }, []);

  /**
   * Abre modal de detalhes do pedido
   */
  const handleViewDetails = useCallback((order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  }, []);

  /**
   * Abre modal de alteração de status
   */
  const handleChangeStatus = useCallback((orderOrOrders = null) => {
    if (orderOrOrders) {
      // Alteração individual
      setStatusModalData({ 
        type: 'single', 
        order: orderOrOrders 
      });
    } else {
      // Alteração em lote
      setStatusModalData({ 
        type: 'multiple', 
        orders: selectedOrders 
      });
    }
    setShowStatusModal(true);
  }, [selectedOrders]);

  /**
   * Confirma alteração de status
   */
  const handleConfirmStatusChange = async (statusId) => {
    try {
      if (statusModalData.type === 'single') {
        await montinkService.updatePedidoStatus(statusModalData.order.id, statusId);
      } else {
        await montinkService.updateMultiplePedidosStatus(statusModalData.orders, statusId);
      }
      
      // Recarrega os pedidos
      await loadOrders();
      
      // Limpa seleção se foi alteração em lote
      if (statusModalData.type === 'multiple') {
        setSelectedOrders([]);
      }
      
      // Fecha modal de detalhes se estiver aberto
      if (showDetailsModal) {
        setShowDetailsModal(false);
      }
      
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      throw err;
    }
  };

  /**
   * Download de PDFs dos pedidos selecionados
   */
  const handleDownloadPDFs = async () => {
    try {
      if (selectedOrders.length === 0) {
        alert('Selecione pelo menos um pedido');
        return;
      }

      const blob = await montinkService.downloadOrdersPDF(selectedOrders);
      
      // Cria link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pedidos_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Erro ao baixar PDFs:', err);
      alert('Erro ao baixar PDFs. Tente novamente.');
    }
  };

  /**
   * Limpa seleção de pedidos
   */
  const handleClearSelection = useCallback(() => {
    setSelectedOrders([]);
  }, []);

  /**
   * Muda página da paginação
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedOrders([]);
  };

  // Renderização de erro
  if (error && !hasPermission('montik')) {
    return (
      <div className="min-h-screen bg-app-dark flex items-center justify-center p-4">
        <div className="bg-app-card border border-red-500 rounded-lg p-6 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-dark p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-app-primary mb-2">Montink</h1>
          <p className="text-gray-400">
            Gerenciamento de pedidos da plataforma Montink - 
            {totalOrders > 0 && ` ${totalOrders} pedido(s) encontrado(s)`}
          </p>
        </div>

        {/* Error Banner */}
        {error && hasPermission('montik') && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <p className="text-red-400 font-medium">Erro</p>
                <p className="text-gray-300">{error}</p>
              </div>
              <button
                onClick={loadInitialData}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}        {/* Filtro horizontal no topo */}
        <div className="mb-6">
          <FilterPanel
            onFilter={handleFilter}
            statusOptions={statusOptions}
          />
        </div>        {/* Layout inferior - Ações e Pedidos */}
        <div className="flex flex-col lg:flex-row gap-4 min-w-0">
          {/* Painel de ações */}
          <div className="lg:w-64 xl:w-72 flex-shrink-0">
            <ActionsPanel />
          </div>

          {/* Área central - Lista de pedidos */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Barra de ações para pedidos selecionados */}
            <OrderActionsBar
              selectedOrders={selectedOrders}
              onDownloadPDFs={handleDownloadPDFs}
              onChangeStatus={() => handleChangeStatus()}
              onClearSelection={handleClearSelection}
            />

            {/* Tabela de pedidos */}
            <OrdersTable
              orders={orders}
              selectedOrders={selectedOrders}
              onSelectOrder={handleSelectOrders}
              onViewDetails={handleViewDetails}
              loading={loading}
            />

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-app-card border border-app-border rounded-lg text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-app-primary text-black font-medium'
                            : 'bg-app-card border border-app-border text-gray-300 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-app-card border border-app-border rounded-lg text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            )}          </div>
        </div>

        {/* Modais */}
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onChangeStatus={handleChangeStatus}
          statusOptions={statusOptions}
        />

        <ChangeStatusModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onConfirm={handleConfirmStatusChange}
          statusOptions={statusOptions}
          currentOrder={statusModalData?.type === 'single' ? statusModalData.order : null}
          selectedOrders={statusModalData?.type === 'multiple' ? statusModalData.orders : []}
        />
      </div>
    </div>
  );
}

export default Montink;
