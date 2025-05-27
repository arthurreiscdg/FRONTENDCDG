import { createContext, useContext, useEffect, useState } from 'react';
import { isAuthenticated, login as authLogin, logout as authLogout, getCurrentUser, hasPermission, getDirectFormPath } from '../services/authService';

// Criando o contexto de autenticação
const AuthContext = createContext();

/**
 * Provider para o contexto de autenticação
 */
export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  // Verifica a autenticação ao iniciar
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      
      if (isAuth) {
        setUser(getCurrentUser());
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    // Adiciona um evento para verificar autenticação quando o localStorage muda
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  /**
   * Função de login
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  const login = async (username, password) => {
    setLoading(true);
    
    try {
      const result = await authLogin(username, password);
      
      if (result.success) {
        setAuthenticated(true);
        setUser(result.user);
      }
      
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Função de logout
   */
  const logout = () => {
    authLogout();
    setAuthenticated(false);
    setUser(null);
  };
  
  /**
   * Verifica se o usuário possui uma permissão específica
   * @param {string} permission 
   * @returns {boolean}
   */
  const checkPermission = (permission) => {
    return hasPermission(permission);
  };
    /**
   * Verifica se o usuário deve ser redirecionado para um formulário específico
   * @returns {string|null} Caminho para o formulário específico ou null
   */
  const getFormPath = () => {
    if (!user) return null;
    return user.directFormPath || null;
  };
  
  // Valores expostos pelo contexto
  const contextValue = {
    loading,
    authenticated,
    user,
    login,
    logout,
    hasPermission: checkPermission,
    getDirectFormPath: getFormPath
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para acessar o contexto de autenticação
 * @returns {Object} O contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

export default AuthContext;
