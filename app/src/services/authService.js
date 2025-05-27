// Authentication service functions
const AUTH_TOKEN_KEY = 'cdg_auth_token';
const USER_INFO_KEY = 'cdg_user_info';

/**
 * Fetch users from the JSON file
 * @returns {Promise<Array>} Array of users
 */
export async function fetchUsers() {
  try {
    const response = await fetch('/users.json');
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

/**
 * Authenticate a user with username and password
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>} Authentication result
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
    
    // Create a token (in real app, this would be done by the server)
    const token = btoa(JSON.stringify({ 
      id: user.id, 
      username: user.username,
      timestamp: new Date().getTime()
    }));
    
    // Store auth data
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
    
    // Save to localStorage
    setAuthData(authData);
    
    return { success: true, ...authData };
  } catch (error) {
    console.error('Erro durante o login:', error);
    return { success: false, message: 'Erro ao realizar login' };
  }
}

/**
 * Log out the current user
 */
export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  localStorage.removeItem('currentUser'); // Remove the old key as well
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  
  if (!token || !userInfo) return false;
  
  try {
    // Decode token to check expiration
    const tokenData = JSON.parse(atob(token));
    const now = new Date().getTime();
    // Token expires after 8 hours
    const isTokenValid = (now - tokenData.timestamp) < 28800000;
    
    return isTokenValid;  } catch (e) {
    return false;
  }
}

/**
 * Store authentication data
 * @param {Object} authData 
 */
export function setAuthData(authData) {
  localStorage.setItem(AUTH_TOKEN_KEY, authData.token);
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(authData.user));
  
  // Also keep compatibility with the old approach
  localStorage.setItem('currentUser', JSON.stringify(authData.user));
}

/**
 * Get current user information
 * @returns {Object|null} User information
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
 * Check if user has a specific permission
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
 * Refresh user data from API (placeholder for real implementation)
 * @returns {Promise<Object|null>} Updated user information
 */
export async function refreshUserData() {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;
    
    // Placeholder for API request
    // In a real app, you would make a request to your backend:
    // const response = await fetch('https://api.casadagrafica.com/auth/me', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    
    // For now, just return the current user
    return getCurrentUser();
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    logout(); // Clear invalid session
    return null;
  }
}
