import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { user: currentUser, hasPermission } = useAuth();
  return (
    <div className="space-y-6">
      <div className="bg-app-card p-6 rounded-xl shadow-lg border border-app-border">
        <h1 className="text-3xl font-bold text-app-primary mb-4">Bem-vindo ao CDG System</h1>
        <p className="text-gray-400">
          Sistema de gerenciamento para Casa da Gráfica
        </p>
      </div>

      {currentUser && (
        <div className="bg-app-card p-6 rounded-xl shadow-lg border border-app-border">
          <h2 className="text-xl font-semibold text-white mb-4">Informações do Usuário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Nome de Usuário</p>
              <p className="font-medium text-white">{currentUser.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium text-white">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Perfil</p>
              <p className="font-medium capitalize text-app-primary">{currentUser.role}</p>
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
    <Link 
      to={path} 
      className="bg-app-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-app-border hover:border-[var(--color-primary)] group block"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">{title}</h3>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>
        </div>        <div className="text-3xl p-2 rounded-md bg-gray-800 bg-opacity-50 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:bg-opacity-20 transition-all">
          {icon}
        </div>
      </div>
    </Link>
  );
}

export default Home;
