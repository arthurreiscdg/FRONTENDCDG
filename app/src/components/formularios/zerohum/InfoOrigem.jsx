import React from 'react';

/**
 * Componente para mostrar informações sobre a origem dos dados (manual ou Excel)
 * 
 * @param {Object} props
 * @param {string} props.metodoPedido - Método de pedido ('manual' ou 'excel')
 * @param {Object} props.arquivoExcel - Arquivo Excel original (se aplicável)
 */
function InfoOrigem({ metodoPedido, arquivoExcel }) {
  // Se não for método Excel ou não tiver arquivo, não mostra nada
  if (metodoPedido !== 'excel' || !arquivoExcel) {
    return null;
  }

  // Formata o tamanho do arquivo em MB
  const formatFileSize = () => {
    const sizeInMB = (arquivoExcel.size / 1024 / 1024).toFixed(2);
    return `${sizeInMB} MB`;
  };

  return (
    <div className="mt-3 p-3 bg-gray-700/30 rounded-md border border-gray-700">
      <div className="flex items-start text-xs text-gray-300">
        <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div>
          <span className="block mb-1">
            Dados extraídos da planilha: <span className="font-medium text-white">{arquivoExcel.name}</span>
          </span>
          <span className="text-green-400/80 block">{formatFileSize()} | Processado automaticamente</span>
        </div>
      </div>
    </div>
  );
}

export default InfoOrigem;
