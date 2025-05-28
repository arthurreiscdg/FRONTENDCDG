# Sistema de Autenticação com Cookies - Frontend

## 📋 Visão Geral

Este documento descreve a implementação do sistema de autenticação usando cookies HTTPOnly seguros no frontend React da Casa da Gráfica.

## 🔒 Arquitetura de Segurança

### Fluxo de Autenticação no Frontend
```
1. Usuário → Formulário de login
2. Frontend → POST /api/auth/login (credentials: 'include')
3. Backend → Resposta com cookie HTTPOnly
4. Navegador → Armazena cookie automaticamente
5. Frontend → Requisições futuras (cookie enviado automaticamente)
```

## 🛠️ Componentes Implementados

### 1. **authService.js** - Serviço de Autenticação

#### Configuração da API
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USER_INFO_KEY = 'cdg_user_info';
```

#### Login com Cookies
```javascript
export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ⚠️ IMPORTANTE: Para enviar/receber cookies
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success && data.token && data.usuario) {
      // Adapta dados do usuário para o formato do frontend
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

      // ⚠️ SALVA APENAS DADOS DO USUÁRIO (token fica no cookie)
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(adaptedUser));
      
      return {
        success: true,
        user: adaptedUser,
        token: data.token
      };
    }
  } catch (error) {
    console.error('Erro no login:', error);
    return { success: false, message: error.message };
  }
}
```

#### Verificação de Token
```javascript
export async function verifyToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verificar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ⚠️ IMPORTANTE: Para enviar cookies automaticamente
    });

    if (!response.ok) {
      clearAuthData();
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.usuario) {
      const adaptedUser = {
        // ... mesmo formato do login
      };

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
```

#### Logout Seguro
```javascript
export async function logout() {
  try {
    // ⚠️ CHAMA ENDPOINT BACKEND PARA LIMPAR COOKIE
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ⚠️ IMPORTANTE: Para enviar cookies
    });
  } catch (error) {
    console.error('Erro ao fazer logout no backend:', error);
  } finally {
    // Sempre limpa dados locais
    clearAuthData();
  }
}
```

#### Limpeza de Dados
```javascript
export function clearAuthData() {
  // ⚠️ REMOVE APENAS DADOS DO USUÁRIO (cookie é gerenciado pelo navegador)
  localStorage.removeItem(USER_INFO_KEY);
  localStorage.removeItem('currentUser'); // Remove chave antiga também
}
```

#### Verificação de Autenticação
```javascript
export function isAuthenticated() {
  // ⚠️ VERIFICA APENAS SE HÁ DADOS DO USUÁRIO
  // Token está no cookie HTTPOnly (não acessível via JavaScript)
  const userInfo = getStoredUser();
  return !!userInfo;
}
```

### 2. **AuthContext.jsx** - Contexto de Autenticação

#### Provider com Verificação Automática
```javascript
export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Verifica autenticação ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Verifica se há dados salvos localmente
        const storedUser = authService.getStoredUser();
        
        if (storedUser) {
          // ⚠️ VERIFICA SE TOKEN AINDA É VÁLIDO NO BACKEND
          const userData = await authService.verifyToken();
          if (userData) {
            setUser(userData);
          } else {
            // Token inválido, limpa dados
            authService.clearAuthData();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        authService.clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (username, password) => {
    try {
      setLoading(true);
      const result = await authService.login(username, password);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro interno no login' };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // ...resto do contexto
}
```

### 3. **SignIn.jsx** - Página de Login

#### Formulário com Redirecionamento Automático
```javascript
function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, authenticated, getDirectFormPath } = useAuth();

  // ⚠️ REDIRECIONA SE JÁ ESTIVER AUTENTICADO
  useEffect(() => {
    if (authenticated) {
      const directPath = getDirectFormPath();
      if (directPath) {
        navigate(directPath, { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [authenticated, navigate, getDirectFormPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // ⚠️ REDIRECIONAMENTO SERÁ FEITO PELO useEffect
        console.log('Login realizado com sucesso:', result.user);
      } else {
        setError(result.message || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ...resto do componente
}
```

### 4. **ProtectedRoute.jsx** - Proteção de Rotas

```javascript
function ProtectedRoute({ requiredPermissions = [], children }) {
  const { authenticated, user, hasPermission, loading } = useAuth();
  const location = useLocation();

  // ⚠️ LOADING ENQUANTO VERIFICA AUTENTICAÇÃO
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // ⚠️ REDIRECIONA PARA LOGIN SE NÃO AUTENTICADO
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ⚠️ VERIFICA PERMISSÕES ESPECÍFICAS
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasRequiredPermissions) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  return children;
}
```

## 🔐 Configurações de Segurança

### Variáveis de Ambiente (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

### Configuração de Requisições
```javascript
// ⚠️ TODAS AS REQUISIÇÕES AUTENTICADAS DEVEM USAR:
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // OBRIGATÓRIO para cookies
  body: JSON.stringify(data)
});
```

## 🎯 Sistema de Permissões

### Geração de Permissões
```javascript
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
```

### Redirecionamento por Tipo de Usuário
```javascript
const USER_FORM_MAPPING = {
  'zerohum': '/formularios/zerohum',
  'coleguium': '/formularios/coleguium',
  'elite': '/formularios/elite',
  'pensi': '/formularios/pensi'
};

export function getDirectFormPath(user) {
  if (!user) return null;
  
  // Role corresponde a uma instituição
  if (user.role && USER_FORM_MAPPING[user.role.toLowerCase()]) {
    return USER_FORM_MAPPING[user.role.toLowerCase()];
  }
  
  // Admin não tem redirecionamento direto
  if (user.role === 'admin' || user.is_admin) {
    return null;
  }
  
  return null;
}
```

## 🧪 Testando o Sistema

### Verificação no DevTools
```javascript
// ⚠️ COOKIE NÃO DEVE SER ACESSÍVEL (HTTPOnly)
console.log(document.cookie); // auth_token NÃO deve aparecer

// ⚠️ DADOS DO USUÁRIO DEVEM ESTAR NO LOCALSTORAGE
console.log(localStorage.getItem('cdg_user_info'));
```

### Estados de Autenticação
1. **Não autenticado**: `user = null`, redirecionamento para `/login`
2. **Autenticado como admin**: Acesso total ao sistema
3. **Autenticado como escola**: Redirecionamento direto para formulário

## 🚨 Considerações de Segurança

### ✅ Implementado
- **Cookies HTTPOnly** - Token não acessível via JavaScript
- **Verificação automática** - Token validado no backend
- **Limpeza segura** - Logout chama backend
- **Credenciais inclusas** - `credentials: 'include'` em todas as requisições
- **Loading states** - UX durante verificação de autenticação

### ⚠️ Boas Práticas
- **Não armazenar tokens** no localStorage/sessionStorage
- **Sempre usar credentials: 'include'** em requisições autenticadas
- **Verificar autenticação** no backend, não apenas no frontend
- **Limpar dados** quando token for inválido

## 🔄 Migração de localStorage para Cookies

### Antes (Inseguro)
```javascript
// ❌ Token no localStorage (vulnerável a XSS)
localStorage.setItem('token', data.token);

// ❌ Verificação apenas local
const token = localStorage.getItem('token');
return !!token;
```

### Depois (Seguro)
```javascript
// ✅ Token em cookie HTTPOnly (gerenciado pelo navegador)
localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData));

// ✅ Verificação no backend
const userData = await authService.verifyToken();
return !!userData;
```

## 📦 Dependências

```json
{
  "react": "^19.1.0",
  "react-router-dom": "^7.6.1"
}
```

## 🔧 Solução de Problemas

### Cookie não está sendo recebido
- Verificar `credentials: 'include'` em todas as requisições
- Confirmar CORS no backend com URL específica
- Checar se backend está enviando `Set-Cookie`

### Redirecionamento não funciona
- Verificar se `AuthContext` está envolvendo toda a aplicação
- Confirmar se `useAuth()` está sendo usado corretamente
- Testar `getDirectFormPath()` com dados do usuário

### Estado de loading infinito
- Verificar se `verifyToken()` está funcionando no backend
- Confirmar se `setLoading(false)` está sendo chamado no `finally`
- Testar endpoint `/api/auth/verificar` diretamente

### Logout não funciona
- Verificar se endpoint `/api/auth/logout` existe no backend
- Confirmar se `credentials: 'include'` está sendo usado
- Testar se `clearAuthData()` está sendo chamado

## 📝 Próximos Passos

1. **Implementar refresh automático** quando token expirar
2. **Adicionar interceptors** para requisições automáticas
3. **Loading states** mais granulares
4. **Notificações** de sessão expirada
5. **Logout automático** em abas múltiplas

---

*Documentação criada em: 28 de maio de 2025*  
*Versão do sistema: 1.0*
