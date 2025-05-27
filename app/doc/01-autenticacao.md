# Documentação do Sistema de Autenticação

## Visão Geral

O sistema de autenticação do CDG System controla o acesso dos usuários às várias funcionalidades da aplicação através de um mecanismo baseado em tokens e permissões. O sistema utiliza armazenamento local (localStorage) para persistir os dados de autenticação entre sessões.

## Componentes Principais

### AuthContext (src/contexts/AuthContext.jsx)

Implementa o padrão Context API do React para disponibilizar as funcionalidades de autenticação em toda a aplicação.

**Funcionalidades:**
- Gerencia o estado de autenticação
- Fornece métodos para login e logout
- Verifica permissões de acesso
- Expõe informações do usuário atual

**Estados principais:**
- `authenticated`: Indica se o usuário está autenticado
- `user`: Objeto com as informações do usuário atual
- `loading`: Indica se o processo de autenticação está em andamento

**Métodos expostos:**
- `login(username, password)`: Autentica o usuário
- `logout()`: Encerra a sessão do usuário
- `hasPermission(permission)`: Verifica se o usuário tem uma permissão específica

### AuthService (src/services/authService.js)

Contém a lógica de negócios relacionada à autenticação, comunicação com a API e gerenciamento de tokens.

**Principais funções:**
- `login(username, password)`: Valida credenciais e obtém token de autenticação
- `logout()`: Remove dados de autenticação do armazenamento local
- `isAuthenticated()`: Verifica se há um token válido armazenado
- `getCurrentUser()`: Recupera os dados do usuário atual
- `hasPermission(permission)`: Verifica se o usuário possui uma permissão específica
- `setAuthData(authData)`: Armazena os dados de autenticação no localStorage
- `refreshUserData()`: Atualiza os dados do usuário a partir da API (implementação temporária)

### ProtectedRoute (src/components/ProtectedRoute.jsx)

Componente de rota que impede o acesso a páginas restritas para usuários não autenticados ou sem as permissões necessárias.

**Funcionalidades:**
- Verifica a autenticação do usuário antes de renderizar uma rota
- Redireciona para a página de login se não estiver autenticado
- Valida se o usuário tem as permissões necessárias para acessar a rota
- Redireciona para a Home se não tiver as permissões necessárias

## Fluxo de Autenticação

1. **Inicialização da aplicação**:
   - O `AuthProvider` verifica se há um token armazenado no localStorage
   - Se existir, o usuário é considerado autenticado e seus dados são carregados
   - O estado `loading` é atualizado para `false` quando a verificação é concluída

2. **Login do usuário**:
   - Usuário fornece credenciais na página SignIn
   - A função `login()` do AuthContext é chamada
   - AuthService valida as credenciais (atualmente usando um arquivo JSON local)
   - Em caso de sucesso, os dados do usuário e o token são armazenados no localStorage
   - O estado `authenticated` é atualizado para `true`
   - O usuário é redirecionado para a página Home

3. **Navegação em rotas protegidas**:
   - O componente `ProtectedRoute` verifica se o usuário está autenticado
   - Verifica também se o usuário possui as permissões necessárias para a rota
   - Se todas as condições forem atendidas, renderiza a rota solicitada
   - Caso contrário, redireciona para uma rota apropriada

4. **Logout do usuário**:
   - A função `logout()` do AuthContext é chamada
   - AuthService remove os dados de autenticação do localStorage
   - O estado `authenticated` é atualizado para `false`
   - O usuário é redirecionado para a página de login

## Persistência de Dados

O sistema usa três chaves no localStorage para persistir dados de autenticação:
- `cdg_auth_token`: Armazena o token de autenticação
- `cdg_user_info`: Armazena as informações do usuário em formato JSON
- `currentUser`: Mantido para compatibilidade com versões anteriores

## Sistema de Permissões

O sistema implementa um controle de acesso baseado em permissões:

- Cada usuário possui um `role` (papel) e um array `permissions` no objeto de usuário
- Administradores (`role: 'admin'`) têm acesso a todas as funcionalidades
- Outros usuários têm acesso baseado em suas permissões específicas
- O método `hasPermission()` verifica se o usuário tem uma permissão específica
- O componente `ProtectedRoute` usa essas permissões para controlar o acesso às rotas

## Acesso Direto a Formulários Institucionais

O sistema implementa um mecanismo de redirecionamento automático para usuários institucionais:

- Usuários identificados como pertencentes a instituições específicas (zerohum, coleguium, elite, pensi) são direcionados automaticamente para seus formulários específicos
- A identificação é feita através da propriedade `role` ou, como fallback, do próprio nome de usuário (`username`)
- Após o login, o sistema verifica se o usuário possui um formulário específico através da função `getDirectFormPath()`
- Se um caminho direto for identificado, o usuário é redirecionado automaticamente, sem passar pela tela de seleção de formulários
- Usuários administrativos continuam tendo acesso a todos os formulários

**Implementação:**
- Mapeamento de tipos de usuário para formulários específicos em `authService.js`
- Função `getDirectFormPath()` exposta pelo contexto de autenticação
- Verificação do caminho direto durante o login e navegação

## Oportunidades de Melhorias

1. Implementar autenticação com servidor real em vez de usar um arquivo JSON local
2. Adicionar refresh token para renovar a autenticação sem exigir novo login
3. Implementar expiração de token e lógica de renovação automática
4. Aprimorar o mecanismo de RBAC (Controle de Acesso Baseado em Funções)
5. Adicionar autenticação de dois fatores para maior segurança
6. Permitir configuração dinâmica de mapeamento de usuários para formulários
