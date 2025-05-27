import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente para proteger rotas que requerem autenticação
 * 
 * @param {Object} props
 * @param {Array} props.requiredPermissions - Lista de permissões necessárias para acessar a rota
 * @param {string} props.redirectTo - Caminho para redirecionamento caso não autenticado
 */
function ProtectedRoute({ requiredPermissions = [], redirectTo = '/' }) {
  const { authenticated, user, hasPermission, loading } = useAuth();

  // Mostra nada enquanto está carregando
  if (loading) {
    return null;
  }

  // Verifica se o usuário está autenticado
  if (!authenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se não há permissões requeridas, apenas verifique a autenticação
  if (!requiredPermissions.length) {
    return <Outlet />;
  }

  // Verifica se o usuário tem todas as permissões necessárias
  const hasAllPermissions = requiredPermissions.every(permission => 
    hasPermission(permission)
  );

  // Se o usuário é admin ou tem todas as permissões
  if (user?.role === 'admin' || hasAllPermissions) {
    return <Outlet />;
  }

  // Redireciona para home se não tem permissão
  return <Navigate to="/home" replace />;
}

export default ProtectedRoute;
