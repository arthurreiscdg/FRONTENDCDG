import React from 'react';
import UserProfile from './UserProfile';
import LogoutButton from './LogoutButton';

const AppHeader = ({ user, onLogout }) => {
  return (
    <header className="
      relative bg-app-card
      backdrop-blur-sm border-b border-app-border/30
      shadow-md shadow-black/10
      transition-all duration-300
    ">
      {/* Main Content */}
      <div className="relative flex items-center justify-between p-4">
        {/* Logo e Título */}
        <div className="flex items-center space-x-3">
          {/* Logo SVG */}
          <div className="flex items-center">
            <img src="/cdg_logo.svg" alt="CDG Logo" className="w-8 h-8" />
          </div>

          {/* Título */}
          <div className="flex flex-col">
            <h1 className="
              text-xl font-medium
              text-app-primary
              tracking-tight
            ">
              CDG SYSTEM
            </h1>
            <p className="text-xs text-gray-400 font-medium opacity-70">
              Casa da Gráfica
            </p>
          </div>
        </div>        {/* User Section */}
        <div className="flex items-center space-x-4">
          {user && (
            <>
              {/* User Profile */}
              <div className="opacity-0 animate-fadeInRight" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
                <UserProfile user={user} />
              </div>
              
              {/* Logout Button */}
              <div className="opacity-0 animate-fadeInRight" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
                <LogoutButton onLogout={onLogout} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-app-primary/50 to-transparent"></div>
    </header>
  );
};

export default AppHeader;
