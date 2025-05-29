import React from 'react';

/**
 * Painel lateral de ações para a página Montink
 * @param {Object} props - Propriedades do componente
 */
function ActionsPanel() {
  const actions = [
    { id: 'enviar-nf', label: 'Enviar NF-es selecionadas', icon: '📧' },
    { id: 'imprimir-nf', label: 'Imprimir NF-es selecionadas', icon: '🖨️' },
    { id: 'enviar-pendentes', label: 'Enviar pendentes', icon: '📤' },
    { id: 'gerar-exportar', label: 'Gerar / Exportar', icon: '📊' },
    { id: 'gerar-pdf-danfe', label: 'Gerar PDF DANFE', icon: '📄' },
    { id: 'exportar-xml', label: 'Exportar XML', icon: '📋' },
    { id: 'mais-opcoes', label: 'Mais opções', icon: '⚙️' },
    { id: 'importar', label: 'Importar', icon: '📥' },
    { id: 'xml-nfe', label: 'XML NF-e', icon: '📑' },
    { id: 'etiquetas-transporte', label: 'Etiquetas de transporte', icon: '🏷️' }
  ];

  const handleActionClick = (actionId) => {
    // Implementação futura - por enquanto apenas log
    console.log(`Ação clicada: ${actionId}`);
  };

  return (
    <div className="w-64 bg-app-card border border-app-border rounded-lg p-4 h-fit">
      <h3 className="text-lg font-semibold text-app-primary mb-4 border-b border-app-border pb-2">
        Ações
      </h3>
      
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            className="w-full flex items-center gap-3 p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              {action.icon}
            </span>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActionsPanel;
