import { useEffect, useState } from 'react';

function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('currentUser');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo ao CDG System</h1>
        <p className="text-gray-600">
          Sistema de gerenciamento para Casa da Gráfica
        </p>
      </div>

      {currentUser && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Usuário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nome de Usuário</p>
              <p className="font-medium">{currentUser.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Perfil</p>
              <p className="font-medium capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Formulários"
          description="Acesse e gerencie os formulários"
          icon="📝"
          path="/formularios"
        />
        <DashboardCard 
          title="Montik" 
          description="Acompanhe as estatísticas"
          icon="📊" 
          path="/montik"
        />
        <DashboardCard 
          title="Administração" 
          description="Gerencie usuários e configurações"
          icon="⚙️" 
          path="/administracao"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, icon, path }) {
  return (
    <a 
      href={path} 
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[#008fad] group"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#008fad] transition-colors">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
    </a>
  );
}

export default Home;
