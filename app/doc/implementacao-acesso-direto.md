# Implementação de Acesso Direto a Formulários

## Visão Geral da Funcionalidade

Esta implementação permite que usuários institucionais, como ZeroHum, Coleguium, Elite e Pensi, sejam direcionados automaticamente para seus formulários específicos após o login, sem passar pela tela de seleção de formulários. Isso melhora a experiência do usuário e simplifica o fluxo de trabalho para instituições parceiras.

## Mudanças Implementadas

### 1. Serviço de Autenticação (authService.js)

- Adicionado mapeamento de tipos de usuário para formulários específicos:
  ```javascript
  const USER_FORM_MAPPING = {
    'zerohum': '/formularios/zerohum',
    'coleguium': '/formularios/coleguium',
    'elite': '/formularios/elite',
    'pensi': '/formularios/pensi'
  };
  ```

- Implementada função `getDirectFormPath()` para determinar o formulário específico do usuário:
  ```javascript
  export function getDirectFormPath(user) {
    // Lógica para determinar se o usuário tem um formulário específico
  }
  ```

- Expandida função `login()` para incluir informações sobre o tipo de usuário e caminho direto

### 2. Contexto de Autenticação (AuthContext.jsx)

- Importada função `getDirectFormPath` do serviço de autenticação
- Adicionado método para verificar se o usuário atual deve acessar um formulário específico
- Exposto o método através do contexto para uso em toda a aplicação

### 3. Página de Login (sigin.jsx)

- Atualizado redirecionamento após login para verificar se o usuário tem um formulário específico
- Modificada lógica para direcionar o usuário para seu formulário específico quando aplicável

### 4. Layout Principal (MainLayout.jsx)

- Implementada verificação de acesso direto ao formulário durante a inicialização
- Configurado redirecionamento automático para o formulário específico quando o usuário acessa a página home

### 5. Página de Formulários (Formularios.jsx)

- Adicionada verificação de acesso direto para redirecionar usuários institucionais
- Implementada lógica para filtrar formulários disponíveis com base nas permissões

### 6. Barra Lateral (Sidebar.jsx)

- Atualizada para considerar o acesso direto aos formulários
- Para usuários institucionais:
  - Removido link para página de seleção de formulários
  - Adicionado link direto para o formulário específico
  - Mantido apenas o acesso à Home e ao formulário específico

### 7. Dados de Usuário (users.json)

- Utilizada propriedade `role` para identificar o tipo de usuário
- Incluídos usuários para todas as instituições: ZeroHum, Coleguium, Elite e Pensi

## Como Funciona

1. Um usuário institucional faz login no sistema
2. O sistema identifica o tipo de usuário e seu formulário específico
3. O usuário é redirecionado automaticamente para seu formulário
4. A barra lateral mostra apenas as opções relevantes para o usuário
5. O acesso à página de seleção de formulários é restrito para esse usuário

## Usuários para Teste

| Username  | Password      | Formulário Direto     |
|-----------|---------------|----------------------|
| zerohum   | zerohum123    | /formularios/zerohum |
| coleguium | coleguium123  | /formularios/coleguium |
| elite     | elite123      | /formularios/elite   |
| pensi     | pensi123      | /formularios/pensi   |
| admin     | admin123      | (acesso a todos)     |
| montik    | montik123     | (acesso normal)      |

## Possíveis Melhorias Futuras

1. Configuração dinâmica de mapeamento de usuários para formulários
2. Interface administrativa para gerenciar acessos diretos
3. Opção para usuários institucionais acessarem outros formulários se tiverem permissão
4. Personalização da interface baseada no tipo de instituição
5. Sistema de notificações específico por instituição
