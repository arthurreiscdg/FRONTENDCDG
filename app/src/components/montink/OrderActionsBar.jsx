import React, { useState } from 'react';

/**
 * Barra de ações para pedidos selecionados
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.selectedOrders - Pedidos selecionados
 * @param {Function} props.onDownloadPDFs - Callback para download de PDFs
 * @param {Function} props.onChangeStatus - Callback para alterar status
 * @param {Function} props.onClearSelection - Callback para limpar seleção
 */
function OrderActionsBar({ selectedOrders = [], onDownloadPDFs, onChangeStatus, onClearSelection }) {
  if (selectedOrders.length === 0) {
    return null;
  }

  return (
    <div className="bg-app-primary bg-opacity-10 border border-app-primary rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-app-primary font-medium">
            {selectedOrders.length} pedido(s) selecionado(s)
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onDownloadPDFs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>📄</span>
            Download PDFs
          </button>
          
          <button
            onClick={onChangeStatus}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>🔄</span>
            Alterar Status
          </button>
          
          <button
            onClick={onClearSelection}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span>✖️</span>
            Limpar Seleção
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderActionsBar;
