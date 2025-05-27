// Funções do serviço de autenticação
const AUTH_TOKEN_KEY = 'cdg_auth_token';
const USER_INFO_KEY = 'cdg_user_info';

/**
 * Busca usuários do arquivo JSON
 * @returns {Promise<Array>} Array de usuários
 */
export async function fetchUsers() {
  try {
    const response = await fetch('/users.json');
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
}

/**
 * Autentica um usuário com nome de usuário e senha
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>} Resultado da autenticação
 */
export async function login(username, password) {
  try {
    const users = await fetchUsers();
    
    const user = users.find(u => 
      u.username === username && u.password === password
    );
    
    if (!user) {
      return { success: false, message: 'Credenciais inválidas' };
    }
    
    // Cria um token (em um app real, isso seria feito pelo servidor)
    const token = btoa(JSON.stringify({ 
      id: user.id, 
      username: user.username,
      timestamp: new Date().getTime()
    }));
    
    // Armazena dados de autenticação
    const authData = {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || user.username,
        permissions: user.permissions || []
      }
    };
    
    // Salva no localStorage
    setAuthData(authData);
    
    return { success: true, ...authData };
  } catch (error) {
    console.error('Erro durante o login:', error);
    return { success: false, message: 'Erro ao realizar login' };
  }
}

/**
 * Desconecta o usuário atual
 */
export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  localStorage.removeItem('currentUser'); // Remove a chave antiga também
}

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  
  if (!token || !userInfo) return false;
  
  try {
    // Decodifica o token para verificar a expiração
    const tokenData = JSON.parse(atob(token));
    const now = new Date().getTime();
    // Token expira após 8 horas
    const isTokenValid = (now - tokenData.timestamp) < 28800000;
    
    return isTokenValid;  } catch (e) {
    return false;
  }
}

/**
 * Armazena dados de autenticação
 * @param {Object} authData 
 */
export function setAuthData(authData) {
  localStorage.setItem(AUTH_TOKEN_KEY, authData.token);
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(authData.user));
  
  // Mantém também compatibilidade com a abordagem antiga
  localStorage.setItem('currentUser', JSON.stringify(authData.user));
}

/**
 * Obtém informações do usuário atual
 * @returns {Object|null} Informações do usuário
 */
export function getCurrentUser() {
  try {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Verifica se o usuário possui uma permissão específica
 * @param {string} permission 
 * @returns {boolean}
 */
export function hasPermission(permission) {
  const user = getCurrentUser();
  
  if (!user || !user.permissions) return false;
    if (user.role === 'admin' || user.permissions.includes('all')) {
    return true;
  }
  
  return user.permissions.includes(permission);
}

/**
 * Atualiza dados do usuário a partir da API (implementação temporária)
 * @returns {Promise<Object|null>} Informações atualizadas do usuário
 */
export async function refreshUserData() {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;
      // Placeholder para requisição à API
    // Em um app real, você faria uma requisição para o seu backend:
    // const response = await fetch('https://api.casadagrafica.com/auth/me', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    
    // Por enquanto, apenas retorna o usuário atual
    return getCurrentUser();
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    logout(); // Limpa sessão inválida
    return null;
  }
}
