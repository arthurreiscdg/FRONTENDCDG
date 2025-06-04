import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';

/**
 * Modal para visualização de detalhes do pedido
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.order - Dados do pedido
 * @param {boolean} props.isOpen - Estado de abertura do modal
 * @param {Function} props.onClose - Callback para fechar o modal
 * @param {Function} props.onChangeStatus - Callback para alterar status
 * @param {Array} props.statusOptions - Opções de status disponíveis
 */
function OrderDetailsModal({ order, isOpen, onClose, onChangeStatus, statusOptions = [] }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && order && activeTab === 'timeline') {
      loadOrderHistory();
    }
  }, [isOpen, order, activeTab]);

  const loadOrderHistory = async () => {
    setLoadingHistory(true);
    try {
      // Implementar busca do histórico do pedido
      // const response = await fetch(`/api/pedidos/${order.id}/historico`);
      // const history = await response.json();
      // setOrderHistory(history);
      
      // Mock data for now
      setOrderHistory([
        { id: 1, status: 'Recebido', data: new Date().toISOString(), usuario: 'Sistema' },
        { id: 2, status: 'Em Processamento', data: new Date().toISOString(), usuario: 'João' }
      ]);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  // Componente de ícone SVG seguindo o padrão do sistema
  const Icon = ({ type, className = "w-4 h-4" }) => {
    const icons = {
      chart: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      box: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
        </svg>
      ),
      truck: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0zM19.5 18.75a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0zM3 6.75h2.25M3 6.75c0-.69.56-1.25 1.25-1.25h16.5c.69 0 1.25.56 1.25 1.25v7.5c0 .69-.56 1.25-1.25 1.25H4.25c-.69 0-1.25-.56-1.25-1.25V6.75zM7.5 10.5h9m-9 3h6" />
        </svg>
      ),
      clock: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),      search: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
      document: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    };
    
    return icons[type] || icons.chart;
  };

  if (!isOpen || !order) return null;

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: 'chart' },
    { id: 'products', label: 'Produtos', icon: 'box' },
    { id: 'shipping', label: 'Envio', icon: 'truck' },
    { id: 'timeline', label: 'Timeline', icon: 'clock' },
    { id: 'raw', label: 'Dados Brutos', icon: 'search' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {      case 'overview':
        return (
          <div className="flex items-center min-h-full">
            <div className="grid grid-cols-2 gap-8 w-full">
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-400">ID do Pedido</label>
                  <p className="text-white font-medium">{order.numero_pedido || order.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Data do Pedido</label>
                  <p className="text-white">{formatDate(order.criado_em)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Cliente</label>
                  <p className="text-white">{order.nome_cliente || '-'}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-400">Valor do Pedido</label>
                  <p className="text-white font-medium text-lg">{formatCurrency(order.valor_pedido)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Quantidade de Produtos</label>
                  <p className="text-white">{order.quantidade || 1}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Valor do Frete</label>
                  <p className="text-white">{formatCurrency(order.custo_envio)}</p>
                </div>
              </div>
            </div>
          </div>
        );      case 'products':
        return (
          <div className="flex items-center min-h-full">
            <div className="w-full">
              <div className="bg-app-dark p-6 rounded-lg border border-app-border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-medium text-lg">{order.nome_produto || 'Produto sem nome'}</h4>
                    <p className="text-gray-400 text-sm mt-1">SKU: {order.sku || '-'}</p>
                    <p className="text-gray-400 text-sm">Quantidade: {order.quantidade || 1}</p>
                  </div>
                  {(order.design_capa_frente || order.mockup_capa_frente) && (
                    <button className="px-4 py-2 bg-app-primary text-gray-400 text-sm rounded hover:bg-opacity-90 transition-colors">
                      Ver Design
                    </button>
                  )}
                </div>
                {order.arquivo_pdf_produto && (
                  <div className="mt-4 pt-4 border-t border-app-border">
                    <a
                      href={order.arquivo_pdf_produto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-app-primary hover:underline text-sm flex items-center gap-2 justify-center"
                    >
                      <Icon type="document" className="w-4 h-4" />
                      Arquivo PDF do Produto
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        );case 'shipping':
        return (
          <div className="flex items-center justify-center min-h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">              <div>
                <h4 className="text-white font-medium mb-4 text-center">Endereço de Entrega</h4>
                <div className="bg-app-dark p-4 rounded-lg border border-app-border space-y-3 h-64">
                  <p className="text-white font-medium">{order.nome_destinatario}</p>
                  <div className="space-y-1">
                    <p className="text-gray-300">
                      {order.endereco}, {order.numero}
                      {order.complemento && `, ${order.complemento}`}
                    </p>
                    <p className="text-gray-300">{order.bairro}</p>
                    <p className="text-gray-300">
                      {order.cidade} - {order.uf}
                    </p>
                    <p className="text-gray-300">CEP: {order.cep}</p>
                    {order.telefone_destinatario && (
                      <p className="text-gray-300">Tel: {order.telefone_destinatario}</p>
                    )}
                  </div>
                </div>
              </div>              
              <div>
                <h4 className="text-white font-medium mb-4 text-center">Mapa</h4>
                <div className="h-64 w-full">
                  <MapComponent
                    endereco={order.endereco}
                    numero={order.numero}
                    bairro={order.bairro}
                    cidade={order.cidade}
                    uf={order.uf}
                    cep={order.cep}
                    className="w-full h-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        );        
        case 'timeline':
        return (
          <div className="flex items-start min-h-full">
            <div className="w-full">
              <h4 className="text-white font-medium text-center mb-6">Histórico do Pedido</h4>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-app-primary"></div>
                  <span className="ml-3 text-gray-300">Carregando histórico...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderHistory.map((entry, index) => (
                    <div key={entry.id} className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-app-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="bg-app-dark p-4 rounded-lg border border-app-border">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{entry.status}</p>
                              <p className="text-gray-400 text-sm">{formatDate(entry.data)}</p>
                            </div>
                            <span className="text-xs text-gray-500">{entry.usuario}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );      
        case 'raw':
        return (
          <div className="flex items-start min-h-full">
            <div className="w-full">
              <h4 className="text-white font-medium text-center mb-6">Payload do Webhook</h4>
              <div className="bg-app-dark p-6 rounded-lg border border-app-border">
                <pre className="text-gray-300 text-sm overflow-auto max-h-96 text-left">
                  {JSON.stringify(order, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-app-card border border-app-border rounded-lg w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-app-border flex-shrink-0"><h2 className="text-xl font-bold text-app-primary">
            Detalhes do Pedido {order.numero_pedido || order.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>       
         {/* Tabs */}
        <div className="flex border-b border-app-border flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-app-primary border-b-2 border-app-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon type={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>        
        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0">
          {renderTabContent()}
        </div>       
        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-app-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              onClick={() => onChangeStatus(order)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Alterar Status
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Documentos
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Imprimir
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
