// Funções de serviço para autenticação
export async function login(username, password) {
  try {
    // Aqui você substitui por uma chamada à sua API real
    const response = await fetch('https://api.casadagrafica.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Falha na autenticação');
    }
    
    const data = await response.json();
    
    // Salvar o token JWT ou outra informação de sessão
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data.user;
  } catch (error) {
    console.error('Erro durante o login:', error);
    throw error;
  }
}

export async function logout() {
  try {
    // Opcional: notificar a API que o usuário está saindo
    const token = localStorage.getItem('token');
    if (token) {
      await fetch('https://api.casadagrafica.com/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Erro durante o logout:', error);
  } finally {
    // Sempre limpar os dados locais
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
}

export async function getCurrentUser() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await fetch('https://api.casadagrafica.com/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Sessão expirada ou inválida');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    return null;
  }
}
