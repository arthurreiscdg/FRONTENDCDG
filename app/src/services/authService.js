// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Funções do serviço de autenticação
const AUTH_TOKEN_KEY = 'cdg_auth_token';
const USER_INFO_KEY = 'cdg_user_info';

// Mapeamento de tipos de usuários para seus formulários específicos
const USER_FORM_MAPPING = {
  'zerohum': '/formularios/zerohum',
  'coleguium': '/formularios/coleguium',
  'elite': '/formularios/elite',
  'pensi': '/formularios/pensi'
};

/**
 * Determina se um usuário deve ser direcionado para um formulário específico
 * @param {Object} user Objeto de usuário
 * @returns {string|null} Caminho para o formulário ou null
 */
export function getDirectFormPath(user) {
  if (!user) return null;
  
  // Se o role corresponder a uma instituição conhecida
  if (user.role && USER_FORM_MAPPING[user.role.toLowerCase()]) {
    return USER_FORM_MAPPING[user.role.toLowerCase()];
  }
  
  // Se o username corresponder exatamente a uma instituição conhecida (fallback)
  if (user.username && USER_FORM_MAPPING[user.username.toLowerCase()]) {
    return USER_FORM_MAPPING[user.username.toLowerCase()];
  }
  
  // Se o perfil for admin ou não tiver acesso direto, retorna null
  if (user.role === 'admin' || user.is_admin) {
    return null;
  }
  
  return null;
}

/**
 * Realiza login no backend
 * @param {string} username Username ou email
 * @param {string} password Senha
 * @returns {Promise<Object>} Dados do usuário e token
 */
export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // IMPORTANTE: Para enviar/receber cookies
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || data.mensagem || 'Erro no login'
      };
    }

    if (data.success && data.token && data.usuario) {
      // Adapta os dados do usuário para o formato esperado pelo frontend
      const adaptedUser = {
        id: data.usuario.id,
        nome: data.usuario.nome,
        username: data.usuario.username,
        email: data.usuario.email,
        role: data.usuario.role,
        is_admin: data.usuario.is_admin,
        roles: data.usuario.roles || [],
        escola_id: data.usuario.escola_id,
        permissions: generatePermissions(data.usuario),
        directFormPath: getDirectFormPath(data.usuario)
      };

      // Salva apenas dados do usuário no localStorage (token fica no cookie HTTPOnly)
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(adaptedUser));
      
      return {
        success: true,
        user: adaptedUser,
        token: data.token
      };
    }

    // Se chegou aqui, é porque success é false ou dados incompletos
    return {
      success: false,
      message: data.message || 'Resposta inválida do servidor'
    };
  } catch (error) {
    console.error('Erro no login:', error);
    return { 
      success: false, 
      message: error.message || 'Erro de conexão com o servidor' 
    };
  }
}

/**
 * Verifica se o token é válido no backend
 * @returns {Promise<Object|null>} Dados do usuário ou null
 */
export async function verifyToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verificar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // IMPORTANTE: Para enviar cookies automaticamente
    });

    if (!response.ok) {
      // Token inválido, limpa o armazenamento
      clearAuthData();
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.usuario) {
      // Adapta os dados do usuário para o formato esperado pelo frontend
      const adaptedUser = {
        id: data.usuario.id,
        nome: data.usuario.nome,
        username: data.usuario.username,
        email: data.usuario.email,
        role: data.usuario.role,
        is_admin: data.usuario.is_admin,
        roles: data.usuario.roles || [],
        escola_id: data.usuario.escola_id,
        permissions: generatePermissions(data.usuario),
        directFormPath: getDirectFormPath(data.usuario)
      };

      // Atualiza os dados do usuário no localStorage
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(adaptedUser));
      return adaptedUser;
    }

    return null;
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    clearAuthData();
    return null;
  }
}

/**
 * Gera permissões baseadas no tipo de usuário
 * @param {Object} usuario Dados do usuário do backend
 * @returns {Array} Array de permissões
 */
function generatePermissions(usuario) {
  const permissions = [];
  
  if (usuario.is_admin) {
    permissions.push('all');
    return permissions;
  }
  
  // Adiciona permissões baseadas nos roles
  if (usuario.roles && usuario.roles.length > 0) {
    permissions.push('formularios');
    usuario.roles.forEach(role => {
      permissions.push(role);
    });
  }
  
  return permissions;
}

/**
 * Limpa os dados de autenticação
 */
export function clearAuthData() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  localStorage.removeItem('currentUser'); // Remove a chave antiga também
}

/**
 * Desconecta o usuário atual
 */
export async function logout() {
  try {
    // Chama o endpoint de logout no backend para limpar o cookie
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // IMPORTANTE: Para enviar cookies
    });
  } catch (error) {
    console.error('Erro ao fazer logout no backend:', error);
  } finally {
    // Sempre limpa os dados locais, independente do resultado da API
    clearAuthData();
  }
}

/**
 * Obtém o token armazenado
 * @returns {string|null} Token ou null
 */
export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Obtém os dados do usuário armazenados
 * @returns {Object|null} Dados do usuário ou null
 */
export function getStoredUser() {
  const userData = localStorage.getItem(USER_INFO_KEY);
  return userData ? JSON.parse(userData) : null;
}

/**
 * Obtém informações do usuário atual (alias para getStoredUser)
 * @returns {Object|null} Informações do usuário
 */
export function getCurrentUser() {
  return getStoredUser();
}

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean}
 */
export function isAuthenticated() {
  // Agora verifica apenas se há dados do usuário (token está no cookie HTTPOnly)
  const userInfo = getStoredUser();
  
  return !!userInfo;
}

/**
 * Verifica se o usuário possui uma permissão específica
 * @param {string} permission 
 * @returns {boolean}
 */
export function hasPermission(permission) {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;
  
  if (user.is_admin || user.permissions.includes('all')) {
    return true;
  }
  
  return user.permissions.includes(permission);
}

/**
 * Atualiza dados do usuário a partir da API
 * @returns {Promise<Object|null>} Informações atualizadas do usuário
 */
export async function refreshUserData() {
  return await verifyToken();
}
