import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [hasNavigatedFromHome, setHasNavigatedFromHome] = useState(false);
  const location = useLocation();
  const { hasPermission, user, getDirectFormPath } = useAuth();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  // Efeito para controlar o auto-fechamento do sidebar baseado na navegação
  useEffect(() => {
    // Se estiver navegando para qualquer página que não seja Home
    if (location.pathname !== '/home') {
      // Marca que o usuário já navegou da Home
      if (!hasNavigatedFromHome) {
        setHasNavigatedFromHome(true);
      }
      // Fecha o sidebar automaticamente quando navegar para outra página
      setIsOpen(false);
    }
    // Se estiver na Home e ainda não navegou, mantém o sidebar aberto
    // Se já navegou antes e voltar para Home, mantém o sidebar fechado
  }, [location.pathname, hasNavigatedFromHome]);
  // Componente de ícone SVG minimalista
  const Icon = ({ type, className = "w-5 h-5" }) => {
    const icons = {
      home: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),      document: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      chart: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      settings: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      user: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      cog: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),      fileText: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h.01M9 12h.01M9 16h.01" />
        </svg>
      )
    };
    
    return icons[type] || icons.home;
  };

  // Lista completa de itens de navegação com suas permissões necessárias
  const allNavItems = [
    { path: '/home', name: 'Home', icon: 'home', permission: null }, // null = todos acessam
    { path: '/formularios', name: 'Formulários', icon: 'document', permission: 'formularios' },
    { path: '/montik', name: 'Montink', icon: 'chart', permission: 'montik' },
    { path: '/administracao', name: 'Administração', icon: 'settings', permission: 'all' },
    { path: '/novo-usuario', name: 'Novo Usuário', icon: 'user', permission: 'all' },
    { path: '/config-montik', name: 'Configurações Montink', icon: 'cog', permission: 'config-montik' },
    { path: '/config-form', name: 'Configurações Form', icon: 'cog', permission: 'all' },
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
      icon: 'fileText',
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
  });  return (
    <div className={`h-full bg-app-card text-white transition-all duration-300 border-r border-app-border ${isOpen ? 'w-64' : 'w-16'} shadow-lg`}>      <div className="flex items-center justify-between p-4 border-b border-app-border bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center overflow-hidden">
          <img src="/cdg_logo.svg" alt="CDG Logo" className="h-7 mr-3 filter brightness-110 drop-shadow-sm flex-shrink-0" />
          <div 
            className={`transition-all duration-300 ease-in-out ${
              isOpen 
                ? 'opacity-100 translate-x-0 max-w-none' 
                : 'opacity-0 -translate-x-4 max-w-0'
            }`}
            style={{ 
              transitionDelay: isOpen ? '150ms' : '0ms' 
            }}
          >
            <h2 className="text-lg font-bold text-app-primary tracking-wide whitespace-nowrap">CDG SYSTEM</h2>
            <p className="text-xs text-gray-400 font-medium whitespace-nowrap">Management Portal</p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200 ${!isOpen && 'mx-auto'} group`}
          title={isOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            )}
          </svg>
        </button>
      </div>      <nav className="p-3">
        {navItems.map((item, index) => {
          // Adiciona separador visual antes de seções administrativas
          const showSeparator = (item.path === '/administracao' || item.path === '/config-montik') && index > 0;
          
          return (
            <div key={item.path}>              {showSeparator && (
                <div className={`px-2 transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen 
                    ? 'opacity-100 translate-x-0 max-w-none my-4 max-h-20' 
                    : 'opacity-0 -translate-x-2 max-w-0 my-0 max-h-0'
                }`}
                style={{ 
                  transitionDelay: isOpen ? '120ms' : '0ms' 
                }}>
                  <div className="border-t border-gray-700"></div>
                  <span className="text-xs text-gray-500 font-medium mt-2 block uppercase tracking-wider whitespace-nowrap">
                    Administração
                  </span>
                </div>
              )}<Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg mb-1 transition-all duration-200 group relative ${
                  location.pathname === item.path 
                    ? 'bg-[var(--color-primary)] shadow-md transform scale-[0.98]' 
                    : 'hover:bg-gray-800 hover:bg-opacity-50 hover:transform hover:scale-[0.99]'
                }`}
              >                <div className={`${location.pathname === item.path ? 'text-black' : 'text-gray-400 group-hover:text-gray-300'} transition-colors flex-shrink-0`}>
                  <Icon type={item.icon} className="w-5 h-5" />
                </div>
                <span 
                  className={`ml-3 text-sm font-medium transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
                    isOpen 
                      ? 'opacity-100 translate-x-0 max-w-none' 
                      : 'opacity-0 -translate-x-2 max-w-0'
                  } ${location.pathname === item.path ? 'text-black' : 'text-gray-300 group-hover:text-white'}`}
                  style={{ 
                    transitionDelay: isOpen ? '100ms' : '0ms' 
                  }}
                >
                  {item.name}
                </span>
                {/* Indicador visual para item ativo - apenas quando menu aberto */}
                {isOpen && location.pathname === item.path && (
                  <div className="absolute right-2 w-2 h-2 bg-black rounded-full opacity-60"></div>
                )}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
