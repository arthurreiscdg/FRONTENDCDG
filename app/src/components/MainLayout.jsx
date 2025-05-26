import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';

function MainLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário está logado
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">CDG System</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              {JSON.parse(localStorage.getItem('currentUser') || '{}').username || 'Usuário'}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Sair
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
