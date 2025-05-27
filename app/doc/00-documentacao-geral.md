# Documentação Geral do Sistema CDG

## Visão Geral

CDG System é uma aplicação web desenvolvida para gerenciar processos operacionais da Casa da Gráfica. O sistema contempla funcionalidades para autenticação de usuários, gerenciamento de permissões, formulários de pedidos específicos para diferentes clientes e interfaces administrativas.

## Arquitetura

O sistema é construído utilizando React como framework principal e segue uma arquitetura baseada em componentes, com contextos para gerenciamento de estado global e rotas protegidas por permissões.

### Estrutura de Arquivos

```
app/
  ├─ public/                 # Arquivos estáticos
  ├─ src/
  │   ├─ assets/             # Recursos gráficos
  │   ├─ components/         # Componentes reutilizáveis
  │   │   ├─ formularios/    # Componentes relacionados a formulários
  │   │   │   ├─ zerohum/    # Componentes específicos do formulário ZeroHum
  │   ├─ contexts/           # Contextos React para estado global
  │   ├─ hooks/              # Hooks personalizados
  │   ├─ pages/              # Componentes de página
  │   │   ├─ formularios/    # Páginas de formulários específicos
  │   ├─ routes/             # Configuração de rotas
  │   ├─ services/           # Serviços para comunicação com APIs
  │   ├─ utils/              # Funções utilitárias
  │   ├─ main.jsx            # Ponto de entrada da aplicação
  │   └─ index.css           # Estilos globais
  ├─ package.json            # Dependências do projeto
  └─ vite.config.js          # Configuração do Vite
```

### Tecnologias Utilizadas

- **Frontend**: React, React Router, Tailwind CSS
- **Construção**: Vite
- **Autenticação**: Baseada em token (localStorage)
- **Estilo**: Tailwind CSS com variáveis CSS personalizadas
- **Persistência de Dados**: Temporariamente usando localStorage (preparado para API)

## Módulos Principais

### Sistema de Autenticação

Gerencia o acesso de usuários através de um mecanismo de autenticação baseado em token, com suporte a diferentes níveis de permissão.

**Componentes principais:**
- `AuthContext.jsx`: Provedor de contexto para autenticação
- `authService.js`: Funções de serviço para autenticação
- `ProtectedRoute.jsx`: Componente para proteger rotas baseado em autenticação e permissões

### Layout e Navegação

Define a estrutura visual e organiza a navegação entre as diferentes seções do sistema.

**Componentes principais:**
- `MainLayout.jsx`: Layout principal para páginas autenticadas
- `Sidebar.jsx`: Barra lateral de navegação
- `AppRoutes.jsx`: Definição das rotas da aplicação

### Formulários

Sistema de captura de informações específicas para diferentes clientes e necessidades.

**Tipos implementados:**
- Formulário ZeroHum
- (Preparado para) Coleguium, Elite, Pensi

**Componentes de apoio:**
- `FormCard.jsx`: Card selecionável para escolha de formulários
- `ProgressBar.jsx`: Barra de progresso para formulários multi-etapas
- `Notification.jsx`: Sistema de notificações para feedback ao usuário

### Fluxo de Formulário ZeroHum

Implementação completa do fluxo de trabalho para pedidos de impressão ZeroHum.

**Etapas:**
1. Método de Pedido
2. Upload de PDF
3. Informações do Trabalho
4. Especificações
5. Escolas e Quantidades
6. Dados de Contato

## Sistema de Permissões

O CDG System implementa um controle de acesso baseado em permissões para garantir que os usuários tenham acesso apenas às funcionalidades relevantes para suas funções.

### Perfis de Usuário

- **Admin**: Acesso irrestrito a todas as funcionalidades
- **Usuário padrão**: Acesso baseado em permissões específicas

### Permissões Implementadas

- `formularios`: Acesso ao módulo de formulários
- `montik`: Acesso ao módulo Montik
- `all`: Acesso a recursos administrativos (equivalente a admin)
- `config-montik`: Acesso às configurações do módulo Montik

### Verificação de Permissões

As permissões são verificadas em dois níveis:
1. **Renderização condicional**: Elementos da interface são exibidos ou ocultados
2. **Proteção de rotas**: Redirecionamento para Home quando não há permissão

## Interface do Usuário

### Tema Visual

O sistema utiliza um tema escuro consistente com acentos coloridos:
- Fundo principal: Cinza escuro (`bg-app-dark`)
- Elementos de UI: Cartões em tons mais escuros (`bg-app-card`)
- Acentos: Cor primária definida como variável CSS (`var(--color-primary)`)
- Bordas: Sutis para separação de elementos (`border-app-border`)

### Componentes de Interface

- Cards interativos
- Formulários estilizados
- Barras de progresso
- Notificações temporárias
- Modais e overlays
- Visualizador de PDF incorporado

## Status Atual e Roadmap

### Funcionalidades Implementadas

- Sistema de autenticação básico
- Controle de acesso baseado em permissões
- Layout principal e navegação
- Formulário ZeroHum completo
- Upload e visualização de PDFs
- Interface para seleção de formulários

### Próximas Etapas

1. Implementação de API backend para comunicação real
2. Implementação dos formulários Coleguium, Elite e Pensi
3. Desenvolvimento do módulo Montik
4. Funcionalidades administrativas completas
5. Relatórios e dashboards analíticos
6. Sistema de notificações em tempo real

## Boas Práticas Adotadas

- Componentização para reuso de código
- Separação clara de responsabilidades
- Estado global gerenciado via Context API
- Carregamento lazy para melhor performance
- Validação de entradas em formulários
- Design responsivo para diferentes tamanhos de tela
- Feedback visual para ações do usuário

## Manutenção e Desenvolvimento

### Adição de Novos Formulários

Para adicionar um novo tipo de formulário:

1. Criar componentes específicos em `src/components/formularios/[nome-formulario]/`
2. Adicionar uma nova página em `src/pages/formularios/[NomeFormulario].jsx`
3. Adicionar entrada correspondente no array `formularioData` em `src/pages/Formularios.jsx`
4. Adicionar rota em `src/routes/AppRoutes.jsx`

### Adição de Novas Permissões

Para adicionar novas permissões:

1. Definir o identificador da permissão
2. Atualizar a função `hasPermission` em `src/services/authService.js`
3. Aplicar verificações nos componentes relevantes utilizando `useAuth().hasPermission()`
4. Adicionar proteções de rota com `requiredPermissions` no componente `ProtectedRoute`

### Extensão do Sistema de Autenticação

Para conectar com um backend real:

1. Atualizar as funções em `src/services/authService.js` para comunicação com API
2. Implementar refresh token para renovação automática
3. Adicionar lógica para expiração de sessão
4. Melhorar o tratamento de erros de autenticação
