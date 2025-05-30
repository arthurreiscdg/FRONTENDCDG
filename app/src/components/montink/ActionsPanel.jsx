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

  // Componente de ícone SVG minimalista
  const Icon = ({ type, className = "w-5 h-5" }) => {
    const icons = {
      send: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      ),
      printer: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096L5.5 19h13l-1.22-5.171m-11.56 0A17.945 17.945 0 0112 13.5c2.219 0 4.372.413 6.28 1.329m-11.56 0a17.949 17.949 0 01-2.72-.096m16.5 0a17.935 17.935 0 01-2.72.096m2.72-.096L18.5 19h-13L6.72 13.829z" />
        </svg>
      ),
      sendUp: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
      chart: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      pdf: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      xml: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h.01M9 12h.01M9 16h.01" />
        </svg>
      ),
      settings: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      download: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
      document: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      tag: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
      bolt: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      )
    };
    
    return icons[type] || icons.bolt;
  };

  const actions = [
    { id: 'enviar-nf', label: 'Enviar NF-es selecionadas', icon: 'send' },
    { id: 'imprimir-nf', label: 'Imprimir NF-es selecionadas', icon: 'printer' },
    { id: 'enviar-pendentes', label: 'Enviar pendentes', icon: 'sendUp' },
    { id: 'gerar-exportar', label: 'Gerar / Exportar', icon: 'chart' },
    { id: 'gerar-pdf-danfe', label: 'Gerar PDF DANFE', icon: 'pdf' },
    { id: 'exportar-xml', label: 'Exportar XML', icon: 'xml' },
    { id: 'mais-opcoes', label: 'Mais opções', icon: 'settings' },
    { id: 'importar', label: 'Importar', icon: 'download' },
    { id: 'xml-nfe', label: 'XML NF-e', icon: 'document' },
    { id: 'etiquetas-transporte', label: 'Etiquetas de transporte', icon: 'tag' }
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
      <div className="bg-app-card border border-app-border rounded-lg overflow-hidden">        {/* Header sempre visível */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 hover:bg-opacity-20 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <Icon type="bolt" className="w-6 h-6 text-app-primary group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-semibold text-app-primary">
              Ações Rápidas
            </h3>
          </div>
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
          <div className="p-4 pt-0 border-t border-app-border">            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  className="flex items-center gap-3 p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-300 group hover:scale-102 hover:shadow-lg hover:border-app-primary/50 border border-transparent"
                >
                  <Icon 
                    type={action.icon} 
                    className="w-5 h-5 text-app-primary group-hover:scale-110 transition-transform duration-300" 
                  />
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
      <div className="flex items-center gap-3 mb-4 border-b border-app-border pb-2">
        <Icon type="bolt" className="w-5 h-5 text-app-primary" />
        <h3 className="text-lg font-semibold text-app-primary">
          Ações Rápidas
        </h3>
      </div>
      
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            className="w-full flex items-center gap-3 p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-300 group hover:scale-102 hover:shadow-lg hover:border-app-primary/50 border border-transparent"
          >
            <Icon 
              type={action.icon} 
              className="w-5 h-5 text-app-primary group-hover:scale-110 transition-transform duration-300" 
            />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActionsPanel;
