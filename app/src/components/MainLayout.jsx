import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

function MainLayout() {
  const navigate = useNavigate();
  const { authenticated, logout, user } = useAuth();
  const { getDirectFormPath } = useAuth();

  // Redirecionar para login se não estiver autenticado
  // ou para formulário específico se for um usuário institucional
  useEffect(() => {
    if (!authenticated) {
      navigate('/');
    } else {
      // Verificar se o usuário tem acesso direto a um formulário específico
      const directFormPath = getDirectFormPath();
      
      // Se o caminho atual for /home e o usuário tiver um formulário direto, redirecionar
      if (directFormPath && window.location.pathname === '/home') {
        navigate(directFormPath);
      }
    }
  }, [authenticated, navigate, getDirectFormPath]);

  const handleLogout = () => {
    logout();
    // O redirecionamento acontecerá automaticamente pelo efeito acima
  };
  return (
    <div className="flex h-screen bg-app-dark">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">        <header className="bg-app-card text-white p-4 flex items-center justify-between border-b border-app-border">
          <h1 className="text-2xl font-bold text-app-primary">CDG System</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center">
                <div className="bg-app-dark p-1 rounded-md border border-app-border mr-2">
                  <span className="text-xs text-gray-400">Perfil:</span>
                  <span className="ml-1 text-sm font-medium text-app-primary capitalize">{user.role}</span>
                </div>
                <span className="text-gray-300 font-medium">{user.username}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-900 hover:bg-red-800 text-white transition-colors"
            >
              Sair
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto bg-app-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
