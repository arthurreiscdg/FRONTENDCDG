import React, { useState } from 'react';

const LogoutButton = ({ onLogout }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await onLogout();
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`
        group relative overflow-hidden
        px-4 py-2 rounded-lg
        bg-app-card/30 hover:bg-red-500/20
        border border-app-border/30 hover:border-red-500/40
        text-gray-300 hover:text-red-400
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:ring-offset-2 focus:ring-offset-app-dark
        ${isLoading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
      `}
    >
      {/* Content */}
      <div className="relative flex items-center space-x-2">
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">Saindo...</span>
          </>
        ) : (
          <>
            <svg 
              className="w-4 h-4 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Sair</span>
          </>
        )}
      </div>
    </button>
  );
};

export default LogoutButton;
