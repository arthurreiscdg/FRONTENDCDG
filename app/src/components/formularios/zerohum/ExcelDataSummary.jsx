import React from 'react';

/**
 * Componente para exibir um resumo dos dados extraídos do Excel
 * 
 * @param {Object} props
 * @param {Object} props.data - Objeto com os dados de escolas e quantidades
 * @param {boolean} props.isLoading - Indica se os dados estão sendo processados
 */
function ExcelDataSummary({ data, isLoading }) {
  // Se não houver dados ou estiver carregando, não mostrar nada
  if ((!data || Object.keys(data).length === 0) && !isLoading) {
    return null;
  }
  
  // Calcular totais
  const totalEscolas = Object.keys(data).length;
  const totalQuantidade = Object.values(data).reduce((a, b) => a + b, 0);
  
  return (
    <div className="mt-4 border-t border-gray-600 pt-4">
      <h4 className="text-sm font-medium mb-2 text-gray-300">
        {isLoading ? 'Processando dados...' : 'Escolas e quantidades identificadas:'}
      </h4>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          <span className="ml-2 text-sm">Analisando planilha...</span>
        </div>
      ) : (
        <>
          <div className="max-h-40 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-1">Unidade</th>
                  <th className="text-right py-1">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([escola, quantidade]) => (
                  <tr key={escola} className="border-b border-gray-800">
                    <td className="py-1 text-white">{escola.replace(/_/g, ' ')}</td>
                    <td className="py-1 text-right text-green-400">{quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Total: {totalQuantidade} cópias em {totalEscolas} escolas
          </p>
        </>
      )}
    </div>
  );
}

export default ExcelDataSummary;
