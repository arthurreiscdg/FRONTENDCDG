import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { hasPermission, user } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Lista completa de itens de navegação com suas permissões necessárias
  const allNavItems = [
    { path: '/home', name: 'Home', icon: '🏠', permission: null }, // null = todos acessam
    { path: '/formularios', name: 'Formulários', icon: '📝', permission: 'formularios' },
    { path: '/montik', name: 'Montik', icon: '📊', permission: 'montik' },
    { path: '/administracao', name: 'Administração', icon: '⚙️', permission: 'all' },
    { path: '/novo-usuario', name: 'Novo Usuário', icon: '👤', permission: 'all' },
    { path: '/config-montik', name: 'Configurações Montik', icon: '🔧', permission: 'config-montik' },
    { path: '/config-form', name: 'Configurações Form', icon: '🔧', permission: 'all' },
  ];
  
  // Filtra os itens de navegação baseado nas permissões do usuário
  const navItems = allNavItems.filter(item => {
    // Se não precisar de permissão, todos podem acessar
    if (item.permission === null) return true;
    
    // Se o usuário for admin ou tiver a permissão específica
    return user?.role === 'admin' || hasPermission(item.permission);
  });
  return (
    <div className={`h-full bg-app-card text-white transition-all duration-300 border-r border-app-border ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between p-4 border-b border-app-border">
        {isOpen && (
          <div className="flex items-center">
            <img src="/cdg_logo.svg" alt="CDG Logo" className="h-8 mr-2 filter brightness-110" />
            <h2 className="text-lg font-bold text-app-primary">CDG SYSTEM</h2>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-md hover:bg-gray-800 text-gray-400 ${!isOpen && 'mx-auto'}`}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>      <nav className="p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-3 rounded-lg mb-1 transition-colors ${
              location.pathname === item.path 
                ? 'bg-[var(--color-primary)]' 
                : 'hover:bg-gray-800 hover:bg-opacity-50'
            }`}
          >
            <span className={`text-xl ${location.pathname === item.path ? 'text-black' : 'text-gray-400'}`}>{item.icon}</span>
            {isOpen && <span className={`ml-3 ${location.pathname === item.path ? 'text-black font-medium' : ''}`}>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
