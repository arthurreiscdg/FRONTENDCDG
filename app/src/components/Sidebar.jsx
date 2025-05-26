import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/home', name: 'Home', icon: '🏠' },
    { path: '/formularios', name: 'Formulários', icon: '📝' },
    { path: '/montik', name: 'Montik', icon: '📊' },
    { path: '/administracao', name: 'Administração', icon: '⚙️' },
    { path: '/novo-usuario', name: 'Novo Usuário', icon: '👤' },
    { path: '/config-montik', name: 'Configurações Montik', icon: '🔧' },
    { path: '/config-form', name: 'Configurações Form', icon: '🔧' },
  ];

  return (
    <div className={`h-full bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {isOpen && (
          <div className="flex items-center">
            <img src="/cdg_logo.svg" alt="CDG Logo" className="h-8 mr-2" />
            <h2 className="text-lg font-bold">CDG SYSTEM</h2>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-md hover:bg-gray-800 ${!isOpen && 'mx-auto'}`}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav className="p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-3 rounded-lg mb-1 transition-colors ${
              location.pathname === item.path ? 'bg-[#008fad]' : 'hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
