import React, { useState } from 'react';

/**
 * Painel lateral de ações para a página Montink
 * @param {Object} props - Propriedades do componente
 */
function ActionsPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (isMobile) {
      setIsExpanded(false); // Fecha o dropdown no mobile após selecionar uma ação
    }
  };

  // Renderização mobile/tablet - dropdown
  if (isMobile) {
    return (
      <div className="bg-app-card border border-app-border rounded-lg overflow-hidden">
        {/* Header sempre visível */}        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 hover:bg-opacity-20 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">⚡</span>
            <h3 className="text-lg font-semibold text-app-primary">
              Ações Rápidas
            </h3>          </div>
          <div className="flex items-center gap-3">
            {/* Texto de instrução quando não expandido */}
            {!isExpanded && (
              <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors hidden md:block">
                Clique para expandir
              </span>
            )}
            
            {/* Ícone de expansão */}
            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Conteúdo expansível */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4 pt-0 border-t border-app-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  className="flex items-center gap-3 p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {action.icon}
                  </span>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderização desktop - painel lateral tradicional
  return (
    <div className="bg-app-card border border-app-border rounded-lg p-4 h-fit">
      <h3 className="text-lg font-semibold text-app-primary mb-4 border-b border-app-border pb-2">
        Ações Rápidas
      </h3>
      
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            className="w-full flex items-center gap-3 p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
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
