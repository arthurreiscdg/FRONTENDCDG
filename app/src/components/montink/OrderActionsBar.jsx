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

  // Componente de ícone SVG seguindo o padrão do sistema
  const Icon = ({ type, className = "w-4 h-4" }) => {
    const icons = {
      download: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      refresh: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      close: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    };
    
    return icons[type] || icons.close;
  };

  return (
    <div className="bg-app-primary bg-opacity-10 border border-app-primary rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-app-primary font-medium">
            {selectedOrders.length} pedido(s) selecionado(s)
          </span>
        </div>
          <div className="flex items-center gap-3">          <button
            onClick={onDownloadPDFs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 border border-gray-500 hover:border-gray-400 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <Icon type="download" />
            Download PDFs
          </button>
          
          <button
            onClick={onChangeStatus}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 border border-gray-600 hover:border-gray-500 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <Icon type="refresh" />
            Alterar Status
          </button>
          
          <button
            onClick={onClearSelection}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <Icon type="close" />
            Limpar Seleção
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderActionsBar;
