import React, { useEffect } from 'react';

const LoadingOverlay = ({ 
  isLoading, 
  message = "Processando formulário...", 
  submessage = "Não feche esta página durante o processamento",
  showProgress = false,
  progress = 0
}) => {
  
  // Bloquear scroll e navegação
  useEffect(() => {
    if (isLoading) {
      // Bloquear scroll
      document.body.style.overflow = 'hidden';
      
      // Bloquear teclas de navegação
      const handleKeyDown = (e) => {
        // Bloquear F5, Ctrl+R, Alt+F4, Esc, etc.
        if (
          e.key === 'F5' || 
          (e.ctrlKey && e.key === 'r') ||
          (e.altKey && e.key === 'F4') ||
          e.key === 'Escape' ||
          (e.ctrlKey && e.key === 'w')
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      // Bloquear botão voltar do navegador
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = 'Processamento em andamento. Tem certeza que deseja sair?';
        return 'Processamento em andamento. Tem certeza que deseja sair?';
      };

      // Adicionar listeners
      document.addEventListener('keydown', handleKeyDown, { capture: true });
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyDown, { capture: true });
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        {/* Spinner principal */}
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        
        {/* Mensagem principal */}
        <div className="loading-message">
          <h3 className="loading-title">{message}</h3>
          <p className="loading-subtitle">{submessage}</p>
        </div>

        {/* Barra de progresso (opcional) */}
        {showProgress && (
          <div className="loading-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress}%</span>
          </div>
        )}

        {/* Indicadores de atividade */}
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        {/* Mensagem de aviso */}
        <div className="loading-warning">
          <svg className="warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Aguarde... Não feche ou atualize a página</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
