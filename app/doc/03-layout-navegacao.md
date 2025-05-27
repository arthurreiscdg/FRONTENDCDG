# Documentação do Layout e Navegação

## Visão Geral

O sistema CDG utiliza uma estrutura de layout consistente para proporcionar uma experiência de usuário fluida e intuitiva. O design segue um tema escuro com elementos de destaque coloridos, criando uma interface moderna e profissional.

## Componentes de Layout

### MainLayout (src/components/MainLayout.jsx)

Componente principal de layout que estrutura todas as páginas autenticadas do sistema.

**Estrutura:**
- Barra lateral (Sidebar) para navegação
- Cabeçalho superior com informações do usuário e botão de logout
- Área de conteúdo principal que renderiza as rotas filhas

**Funcionalidades:**
- Verifica autenticação do usuário e redireciona para login quando necessário
- Exibe informações do usuário logado (nome e perfil)
- Fornece acesso à função de logout
- Utiliza o componente Outlet do React Router para renderizar o conteúdo dinâmico

**Integração com autenticação:**
- Acessa o contexto de autenticação via `useAuth()`
- Redireciona automaticamente usuários não autenticados

### Sidebar (src/components/Sidebar.jsx)

Barra lateral de navegação que exibe links para as diferentes seções do sistema.

**Funcionalidades:**
- Pode ser expandida ou recolhida para otimizar o espaço da tela
- Exibe apenas as opções de menu que o usuário tem permissão para acessar
- Destaca visualmente a opção de menu correspondente à página atual
- Organiza os itens de navegação em uma estrutura hierárquica

**Itens de navegação:**
- Home
- Formulários
- Montik
- Administração
- Novo Usuário
- Configurações Montik
- Configurações Form

**Sistema de permissões:**
- Filtra os itens de navegação com base nas permissões do usuário
- Implementa verificação por meio da função `hasPermission`
- Usuários com perfil "admin" têm acesso a todos os itens

## Rotas e Navegação

### AppRoutes (src/routes/AppRoutes.jsx)

Define a estrutura de rotas da aplicação e implementa o carregamento lazy (sob demanda) de componentes.

**Características:**
- Utiliza React Router para gerenciamento de rotas
- Implementa carregamento lazy de componentes pesados para melhor performance
- Exibe tela de carregamento durante a verificação de autenticação
- Aplica proteção de rotas com base em permissões

**Componentes de roteamento:**
- `ProtectedRoute`: Garante que apenas usuários autenticados acessem rotas protegidas
- `React.Suspense`: Exibe o componente LoadingScreen durante o carregamento lazy

**Estratégia de carregamento:**
- Componentes menores são carregados diretamente
- Componentes maiores (como formulários complexos) utilizam carregamento lazy

### LoadingScreen

Tela de carregamento exibida durante a inicialização da aplicação ou durante o carregamento de componentes lazy.

**Elementos:**
- Logo do CDG
- Indicador de carregamento animado (spinner)
- Mensagem de status

## Páginas Principais

### Home (src/pages/Home.jsx)

Página inicial do sistema após autenticação.

**Funcionalidades:**
- Dashboard com acesso rápido às funcionalidades mais utilizadas
- Exibe cards para diferentes seções do sistema
- Personaliza o conteúdo com base nas permissões do usuário

### SignIn (src/pages/sigin.jsx)

Página de login do sistema.

**Funcionalidades:**
- Formulário de autenticação com campos de usuário e senha
- Validação de entradas
- Exibição de mensagens de erro
- Redirecionamento automático para Home após autenticação bem-sucedida

### Formularios (src/pages/Formularios.jsx)

Página que lista os tipos de formulários disponíveis no sistema.

**Funcionalidades:**
- Exibe cards para cada tipo de formulário
- Fornece descrições e ícones distintivos para cada opção
- Permite seleção e navegação para o formulário escolhido

## Elementos Visuais e Estilo

### Tema e Cores

O sistema utiliza um tema escuro com cores de destaque, definidas por variáveis CSS:
- Fundo principal: bg-app-dark
- Cards e elementos de interface: bg-app-card
- Cor primária: var(--color-primary)
- Bordas e separadores: border-app-border

### Componentes Visuais Comuns

- Cards com efeitos de hover
- Botões com diferentes variantes (primário, secundário, perigo)
- Barras de progresso para processos multi-etapas
- Ícones e indicadores visuais
- Modais e overlays

## Responsividade

A interface é construída com foco em responsividade:
- Sidebar pode ser recolhida em telas menores
- Layout flexível que se adapta a diferentes tamanhos de tela
- Uso de Flexbox e Grid para organização de elementos

## Oportunidades de Melhorias

1. Implementar temas alternativo (claro/escuro) com preferência do usuário
2. Melhorar a acessibilidade com suporte a navegação por teclado e leitores de tela
3. Adicionar animações de transição entre páginas para uma experiência mais fluida
4. Implementar modo offline com sincronização posterior
5. Adicionar notificações em tempo real para atualizações do sistema
6. Melhorar a adaptação para dispositivos móveis
