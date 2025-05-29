import React, { useState } from 'react';

/**
 * Modal para alteração de status do pedido
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Estado de abertura do modal
 * @param {Function} props.onClose - Callback para fechar o modal
 * @param {Function} props.onConfirm - Callback para confirmar alteração
 * @param {Array} props.statusOptions - Opções de status disponíveis
 * @param {Object} props.currentOrder - Pedido atual (para alteração individual)
 * @param {Array} props.selectedOrders - Pedidos selecionados (para alteração em lote)
 */
function ChangeStatusModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  statusOptions = [], 
  currentOrder = null, 
  selectedOrders = [] 
}) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedStatus) {
      alert('Por favor, selecione um status');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(selectedStatus);
      setSelectedStatus('');
      onClose();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus('');
    onClose();
  };

  if (!isOpen) return null;

  const isMultiple = selectedOrders.length > 1;
  const orderCount = isMultiple ? selectedOrders.length : 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-app-card border border-app-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-app-border">
          <h2 className="text-lg font-bold text-app-primary">
            Alterar Status {isMultiple && `(${orderCount} pedidos)`}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            {isMultiple ? (
              <p className="text-gray-300 mb-4">
                Você está alterando o status de <strong>{orderCount} pedidos</strong>. 
                Esta ação será aplicada a todos os pedidos selecionados.
              </p>
            ) : (
              <p className="text-gray-300 mb-4">
                Alterando status do pedido <strong>#{currentOrder?.numero_pedido || currentOrder?.id}</strong>
              </p>
            )}

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Novo Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 bg-app-dark border border-app-border rounded-lg text-white focus:border-app-primary focus:outline-none"
              disabled={loading}
            >
              <option value="">Selecione um status...</option>
              {statusOptions.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Preview do status selecionado */}
          {selectedStatus && (
            <div className="mb-4 p-3 bg-app-dark border border-app-border rounded-lg">
              <p className="text-sm text-gray-400">Status selecionado:</p>
              <p className="text-white font-medium">
                {statusOptions.find(s => s.id === parseInt(selectedStatus))?.nome}
              </p>
              {statusOptions.find(s => s.id === parseInt(selectedStatus))?.descricao && (
                <p className="text-gray-400 text-sm mt-1">
                  {statusOptions.find(s => s.id === parseInt(selectedStatus))?.descricao}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-app-border">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-app-primary text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            disabled={loading || !selectedStatus}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black"></div>
                Alterando...
              </div>
            ) : (
              'Confirmar Alteração'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeStatusModal;
