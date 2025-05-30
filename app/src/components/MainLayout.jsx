import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import AppHeader from './header/AppHeader';
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
      <Sidebar />      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader user={user} onLogout={handleLogout} />
        <main className="flex-1 p-6 overflow-y-auto bg-app-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
