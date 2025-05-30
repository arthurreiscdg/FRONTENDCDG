import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { user: currentUser, hasPermission } = useAuth();
  return (
    <div className="space-y-8">
      <div className="bg-app-card p-8 rounded-xl border border-app-border">
        <h1 className="text-3xl font-bold text-app-primary mb-2">Bem-vindo ao CDG System</h1>
        <p className="text-gray-400">
          Sistema de gerenciamento para Casa da Gráfica
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Formulários"
          description="Acesse e gerencie os formulários"
          iconType="document"
          path="/formularios"
        />
        <DashboardCard 
          title="Montink" 
          description="Acompanhe e Gerencie os pedidos da Montink"
          iconType="chart" 
          path="/montik"
        />
        <DashboardCard 
          title="Administração" 
          description="Gerencie usuários e configurações"
          iconType="settings" 
          path="/administracao"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, iconType, path }) {
  // Componente de ícone SVG reutilizando a biblioteca do Sidebar
  const Icon = ({ type, className }) => {
    const icons = {
      document: (
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
      )
    };
    
    return icons[type] || icons.document;
  };
  return (
    <Link 
      to={path} 
      className="bg-app-card p-6 rounded-xl border border-app-border hover:border-app-primary/50 group block transition-all duration-300 hover:bg-app-card/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-app-primary/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-app-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
        </div>        <div className="ml-4 p-3 rounded-lg bg-app-primary/10 text-app-primary group-hover:bg-app-primary/30 group-hover:scale-110 transition-all duration-300">
          <Icon type={iconType} className="w-8 h-8" />
        </div>
      </div>
    </Link>
  );
}

export default Home;
