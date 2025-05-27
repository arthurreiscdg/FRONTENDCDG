import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { hasPermission, user, getDirectFormPath } = useAuth();

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
    // Verifica se o usuário tem acesso direto a um formulário
  const directFormPath = getDirectFormPath();
  
  // Se o usuário tem acesso direto, adiciona o item de navegação correspondente
  let finalNavItems = [...allNavItems];
  
  if (directFormPath) {
    // Encontrar qual formulário corresponde ao caminho
    let formName = '';
    if (directFormPath.includes('zerohum')) formName = 'ZeroHum';
    else if (directFormPath.includes('coleguium')) formName = 'Coleguium';
    else if (directFormPath.includes('elite')) formName = 'Elite';
    else if (directFormPath.includes('pensi')) formName = 'Pensi';
    
    // Adiciona o link direto para o formulário específico
    finalNavItems.push({
      path: directFormPath,
      name: `Formulário ${formName}`,
      icon: '📄',
      permission: null // Acessível para este usuário
    });
  }
  
  // Filtra os itens de navegação baseado nas permissões do usuário
  const navItems = finalNavItems.filter(item => {
    // Se o usuário tem acesso direto a um formulário, mostrar apenas Home e link direto para o formulário
    if (directFormPath) {
      // Para usuários institucionais, mostrar apenas Home e esconder o item Formulários
      if (item.path === '/formularios') return false;
      
      // Se for a página Home, sempre mostrar
      if (item.permission === null) return true;
      
      // Esconder todos os outros itens
      return false;
    }
    
    // Para usuários normais, segue a lógica padrão
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
