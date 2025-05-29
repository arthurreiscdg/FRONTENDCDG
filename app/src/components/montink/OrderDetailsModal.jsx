import React, { useState, useEffect } from 'react';

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

  if (!isOpen || !order) return null;

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'products', label: 'Produtos', icon: '📦' },
    { id: 'shipping', label: 'Envio', icon: '🚚' },
    { id: 'timeline', label: 'Timeline', icon: '⏱️' },
    { id: 'raw', label: 'Dados Brutos', icon: '🔍' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">ID do Pedido</label>
                <p className="text-white font-medium">#{order.numero_pedido || order.id}</p>
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
            <div className="space-y-4">
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
        );

      case 'products':
        return (
          <div className="space-y-4">
            <div className="bg-app-dark p-4 rounded-lg border border-app-border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-medium">{order.nome_produto || 'Produto sem nome'}</h4>
                  <p className="text-gray-400 text-sm">SKU: {order.sku || '-'}</p>
                  <p className="text-gray-400 text-sm">Quantidade: {order.quantidade || 1}</p>
                </div>
                {(order.design_capa_frente || order.mockup_capa_frente) && (
                  <button className="px-3 py-1 bg-app-primary text-black text-sm rounded hover:bg-opacity-90">
                    Ver Design
                  </button>
                )}
              </div>
              {order.arquivo_pdf_produto && (
                <div className="mt-3">
                  <a
                    href={order.arquivo_pdf_produto}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-app-primary hover:underline text-sm"
                  >
                    📄 Arquivo PDF do Produto
                  </a>
                </div>
              )}
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-4">Endereço de Entrega</h4>
              <div className="bg-app-dark p-4 rounded-lg border border-app-border space-y-2">
                <p className="text-white font-medium">{order.nome_destinatario}</p>
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
            <div>
              <h4 className="text-white font-medium mb-4">Mapa</h4>
              <div className="bg-app-dark p-4 rounded-lg border border-app-border h-64 flex items-center justify-center">
                <p className="text-gray-400">Mapa será implementado com API externa</p>
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-4">
            <h4 className="text-white font-medium">Histórico do Pedido</h4>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-app-primary"></div>
                <span className="ml-3 text-gray-300">Carregando histórico...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {orderHistory.map((entry, index) => (
                  <div key={entry.id} className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-app-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="bg-app-dark p-3 rounded-lg border border-app-border">
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
        );

      case 'raw':
        return (
          <div className="space-y-4">
            <h4 className="text-white font-medium">Payload do Webhook</h4>
            <div className="bg-app-dark p-4 rounded-lg border border-app-border">
              <pre className="text-gray-300 text-sm overflow-auto max-h-96">
                {JSON.stringify(order, null, 2)}
              </pre>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-app-card border border-app-border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-app-border">
          <h2 className="text-xl font-bold text-app-primary">
            Detalhes do Pedido #{order.numero_pedido || order.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-app-border">
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
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-app-border">
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
