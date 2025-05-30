import React, { useState } from 'react';

/**
 * Tabela para listagem de pedidos da Montink
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.orders - Lista de pedidos
 * @param {Array} props.selectedOrders - Pedidos selecionados
 * @param {Function} props.onSelectOrder - Callback para seleção de pedidos
 * @param {Function} props.onViewDetails - Callback para visualizar detalhes
 * @param {boolean} props.loading - Estado de carregamento
 */
function OrdersTable({ 
  orders = [], 
  selectedOrders = [], 
  onSelectOrder, 
  onViewDetails, 
  loading = false 
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSelected = (orderId) => selectedOrders.includes(orderId);

  const handleSelectAll = (checked) => {
    if (checked) {
      const allOrderIds = orders.map(order => order.id);
      onSelectOrder(allOrderIds);
    } else {
      onSelectOrder([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      onSelectOrder([...selectedOrders, orderId]);
    } else {
      onSelectOrder(selectedOrders.filter(id => id !== orderId));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getStatusColor = (status) => {
    if (!status?.cor_css) return 'bg-gray-500';
    return `bg-[${status.cor_css}]`;
  };

  const getMetodoEnvio = (metodo) => {
    const metodos = {
      1: { nome: 'Correios', icon: '📦' },
      2: { nome: 'Transp.', icon: '🚛' },
      3: { nome: 'Retirada', icon: '🏪' }
    };
    return metodos[metodo] || { nome: 'N/A', icon: '❓' };
  };

  if (loading) {
    return (
      <div className="bg-app-card border border-app-border rounded-lg p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-app-primary"></div>
          <span className="text-gray-300 text-sm">Carregando pedidos...</span>
        </div>
      </div>
    );
  }

  // Renderização mobile com cards
  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* Header para seleção geral no mobile */}
        <div className="bg-app-card border border-app-border rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={orders.length > 0 && selectedOrders.length === orders.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-app-border bg-app-dark focus:ring-app-primary text-app-primary"
            />
            <span className="text-gray-300 text-sm font-medium">
              {selectedOrders.length > 0 ? `${selectedOrders.length} selecionados` : 'Selecionar todos'}
            </span>
          </div>
          <span className="text-gray-400 text-xs">{orders.length} pedidos</span>
        </div>

        {/* Cards dos pedidos */}
        {orders.length === 0 ? (
          <div className="bg-app-card border border-app-border rounded-lg p-8 text-center">
            <div className="text-gray-400 text-sm">📦</div>
            <p className="text-gray-400 text-sm mt-2">Nenhum pedido encontrado</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className={`bg-app-card border rounded-lg p-4 transition-all ${
                isSelected(order.id) 
                  ? 'border-app-primary bg-app-primary bg-opacity-5' 
                  : 'border-app-border hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected(order.id)}
                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                    className="rounded border-app-border bg-app-dark focus:ring-app-primary text-app-primary"
                  />                  <div>
                    <div className="text-white font-medium text-sm">{order.numero_pedido || order.id}</div>
                    <div className="text-gray-400 text-xs">{order.sku || 'Sem SKU'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: order.status?.cor_css || '#6B7280' }}
                  >
                    {order.status?.nome || 'Pendente'}
                  </span>
                </div>
              </div>              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <span className="text-gray-400">Valor:</span>
                  <div className="text-white font-medium">{formatCurrency(order.valor_pedido)}</div>
                </div>
                <div>
                  <span className="text-gray-400">Data:</span>
                  <div className="text-white">{formatDate(order.criado_em)}</div>
                </div>
                <div>
                  <span className="text-gray-400">Envio:</span>
                  <div className="text-white flex items-center space-x-1">
                    <span>{getMetodoEnvio(order.metodo_envio).icon}</span>
                    <span>{getMetodoEnvio(order.metodo_envio).nome}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Produto:</span>
                  <div className="text-white font-medium truncate">{order.nome_produto || '-'}</div>
                </div>
              </div>              <button
                onClick={() => onViewDetails(order)}
                className="w-full px-3 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors"
              >
                Ver detalhes
              </button>
            </div>
          ))
        )}
      </div>
    );
  }

  // Renderização desktop com tabela compacta
  return (
    <div className="bg-app-card border border-app-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-app-dark border-b border-app-border">
            <tr>
              <th className="p-2 text-left w-8">
                <input
                  type="checkbox"
                  checked={orders.length > 0 && selectedOrders.length === orders.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-app-border bg-app-dark focus:ring-app-primary text-app-primary"
                />
              </th>              <th className="p-2 text-left text-gray-300 font-medium">Nº</th>
              <th className="p-2 text-left text-gray-300 font-medium">SKU</th>
              <th className="p-2 text-left text-gray-300 font-medium">Data</th>
              <th className="p-2 text-left text-gray-300 font-medium">Envio</th>
              <th className="p-2 text-left text-gray-300 font-medium">Valor</th>
              <th className="p-2 text-left text-gray-300 font-medium">Produto</th>
              <th className="p-2 text-left text-gray-300 font-medium">Status</th>
              <th className="p-2 text-left text-gray-300 font-medium w-20">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-400">
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">📦</span>
                    <span>Nenhum pedido encontrado</span>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b border-app-border hover:bg-gray-800 hover:bg-opacity-20 transition-colors ${
                    isSelected(order.id) ? 'bg-app-primary bg-opacity-5' : ''
                  }`}
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={isSelected(order.id)}
                      onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                      className="rounded border-app-border bg-app-dark focus:ring-app-primary text-app-primary"
                    />
                  </td>                  <td className="p-2 text-white font-medium">
                    {order.numero_pedido || order.id}
                  </td>
                  <td className="p-2 text-gray-300 max-w-20 truncate" title={order.sku}>
                    {order.sku || '-'}
                  </td>
                  <td className="p-2 text-gray-300">
                    {formatDate(order.criado_em)}
                  </td>
                  <td className="p-2 text-gray-300">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{getMetodoEnvio(order.metodo_envio).icon}</span>
                      <span className="hidden lg:inline">{getMetodoEnvio(order.metodo_envio).nome}</span>
                    </div>
                  </td>
                  <td className="p-2 text-gray-300 font-medium">
                    {formatCurrency(order.valor_pedido)}
                  </td>
                  <td className="p-2 text-gray-300 max-w-32 truncate" title={order.nome_produto}>
                    {order.nome_produto || '-'}
                  </td>
                  <td className="p-2">
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
                      style={{ backgroundColor: order.status?.cor_css || '#6B7280' }}
                    >
                      {order.status?.nome || 'Pendente'}
                    </span>
                  </td>                  <td className="p-2">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="px-2 py-1 bg-white text-black text-xs font-medium rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                      Ver mais
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;
