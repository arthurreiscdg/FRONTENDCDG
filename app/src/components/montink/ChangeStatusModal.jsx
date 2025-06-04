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
  };  if (!isOpen) return null;

  const isMultiple = selectedOrders.length > 1;
  const orderCount = isMultiple ? selectedOrders.length : 1;  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-app-card border border-app-border rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}        
        <div className="flex justify-between items-center p-6 border-b border-app-border">          <h2 className="text-lg font-bold text-app-primary">
            {isMultiple 
              ? `Alterar Status (${orderCount} pedidos)` 
              : `Alterar Status - Pedido #`
            }
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>       
         {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4">
            {isMultiple ? (
              <p className="text-gray-300 mb-6">
                Você está alterando o status de <strong>{orderCount} pedidos</strong>. 
                Esta ação será aplicada a todos os pedidos selecionados.
              </p>
            ) : (
              <div className="mb-6 flex items-center gap-4">
                <p className="text-gray-300">
                  Alterando status do pedido <strong>#</strong>
                </p>
                {/* Preview do status selecionado - ao lado */}
                {selectedStatus && (
                  <div className="flex-1 p-2 bg-app-primary bg-opacity-10 border border-app-primary rounded-lg">
                    <p className="text-xs text-app-primary font-medium">Status selecionado:</p>
                    <p className="text-white text-sm font-medium">
                      {statusOptions.find(s => s.id === parseInt(selectedStatus))?.nome}
                    </p>
                  </div>
                )}
              </div>
            )}

            <label className="block text-sm font-medium text-gray-300 mb-4">
              Selecione o novo status:
            </label>

            {/* Lista de opções de status */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id.toString())}
                  disabled={loading}
                  className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                    selectedStatus === status.id.toString()
                      ? 'bg-app-primary bg-opacity-20 border-app-primary text-app-primary'
                      : 'bg-app-dark border-app-border text-gray-300 hover:bg-gray-800 hover:border-gray-600'
                  } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <div className="font-medium">{status.nome}</div>
                  {status.descricao && (
                    <div className="text-sm text-gray-400 mt-1">{status.descricao}</div>
                  )}
                </button>
              ))}
            </div>

            {/* Preview do status selecionado para múltiplos pedidos */}
            {isMultiple && selectedStatus && (
              <div className="mt-4 p-3 bg-app-primary bg-opacity-10 border border-app-primary rounded-lg">
                <p className="text-sm text-app-primary font-medium">Status selecionado:</p>
                <p className="text-white font-medium">
                  {statusOptions.find(s => s.id === parseInt(selectedStatus))?.nome}
                </p>
              </div>
            )}
          </div>
        </div>{/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-app-border flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !selectedStatus}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
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
