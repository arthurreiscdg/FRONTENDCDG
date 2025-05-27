# Documentação do Sistema de Notificação e Componentes Auxiliares

## Visão Geral

O sistema CDG incorpora diversos componentes auxiliares que melhoram a experiência do usuário, fornecem feedback e facilitam a interação com o sistema. Esta documentação aborda os componentes de notificação, visualização de PDFs e outros elementos de apoio.

## Sistema de Notificações

### Notification (src/components/Notification.jsx)

Componente responsável por exibir mensagens temporárias de feedback para o usuário.

**Propriedades:**
- `message`: Texto da mensagem a ser exibida
- `type`: Tipo da notificação (success, error, info, warning)
- `duration`: Duração em milissegundos (0 para não fechar automaticamente)
- `onClose`: Função de callback chamada quando a notificação é fechada

**Estilos por tipo:**
- success: Verde (bg-green-500)
- error: Vermelho (bg-red-500)
- warning: Amarelo (bg-yellow-500)
- info: Azul (bg-blue-500)

**Funcionamento:**
- Aparece com uma animação suave
- Fecha automaticamente após a duração especificada
- Pode ser fechada manualmente pelo usuário
- Mantém consistência visual com o tema da aplicação

**Uso no sistema:**
- Confirmação de ações bem-sucedidas
- Alertas sobre erros
- Avisos sobre ações necessárias
- Informações contextuais para o usuário

## Visualização de PDFs

### PdfPreviewModal (src/components/PdfPreviewModal.jsx)

Modal para visualização de documentos PDF sem sair da aplicação.

**Funcionalidades:**
- Exibe o conteúdo do PDF diretamente na interface
- Permite navegar pelas páginas do documento
- Oferece controles de zoom
- Possibilita o fechamento do modal para retornar à tela anterior

**Integração:**
- Utilizado principalmente no componente UploadPDF para visualização prévia de arquivos
- Integrado ao fluxo de formulários para revisão de documentos

## Proteção de Rotas

### ProtectedRoute (src/components/ProtectedRoute.jsx)

Componente que protege rotas com base na autenticação e permissões do usuário.

**Propriedades:**
- `requiredPermissions`: Array de permissões necessárias para acessar a rota
- `redirectTo`: Caminho para redirecionamento caso não autenticado

**Funcionamento:**
- Verifica se o usuário está autenticado
- Checa se o usuário possui as permissões necessárias
- Redireciona para a rota especificada se não atender aos requisitos
- Permite acesso irrestrito a administradores (`role: 'admin'`)

**Integração com sistema de permissões:**
- Utiliza o contexto de autenticação (`useAuth()`)
- Verifica permissões através da função `hasPermission`
- Suporta verificação de múltiplas permissões (todas necessárias)

## Componentes de UI

### FormCard (src/components/FormCard.jsx)

Card interativo que representa uma opção selecionável no sistema.

**Propriedades:**
- `title`: Título do card
- `description`: Descrição textual do conteúdo
- `icon`: Ícone representativo
- `path`: Caminho de navegação associado
- `onSelect`: Função de callback para quando o card é selecionado

**Características visuais:**
- Efeito de hover com transição de cores
- Destaque da borda ao passar o mouse
- Mudança de cor do botão de ação
- Design consistente com o tema da aplicação

**Uso no sistema:**
- Seleção de tipos de formulários
- Opções na página inicial
- Escolhas em processos de fluxo

### ProgressBar (src/components/formularios/ProgressBar.jsx)

Barra de progresso para processos multi-etapas.

**Propriedades:**
- `currentStep`: Número da etapa atual
- `steps`: Array de objetos com informações das etapas

**Características visuais:**
- Círculos numerados para cada etapa
- Conexão visual entre etapas com linhas de progresso
- Destaque colorido para etapas ativas e concluídas
- Marcação com símbolo ✓ para etapas já completadas

**Uso no sistema:**
- Navegação em formulários multi-etapas
- Indicador de progresso em processos complexos

## Elementos Auxiliares

### LoadingScreen (src/routes/AppRoutes.jsx)

Tela de carregamento exibida durante a inicialização da aplicação.

**Elementos:**
- Logo do sistema
- Animação de spinner
- Mensagem de status

**Uso no sistema:**
- Exibido durante o carregamento inicial
- Aparece durante a verificação de autenticação
- Mostrado durante o carregamento lazy de componentes

## Interação com Arquivos

### Upload de Arquivos

O sistema implementa funcionalidades avançadas para upload de arquivos:

**Métodos de upload:**
- Seleção via diálogo de arquivo
- Drag-and-drop (arrastar e soltar)

**Recursos:**
- Validação de tipos de arquivo
- Limitação de tamanho
- Formatação de tamanho para exibição
- Visualização prévia
- Remoção de arquivos selecionados

### Visualização de PDFs

O sistema permite a visualização in-app de documentos PDF:

**Funcionalidades:**
- Abertura em modal sem sair do sistema
- Navegação entre páginas
- Zoom e ajustes de visualização
- Interface integrada ao tema da aplicação

## Oportunidades de Melhorias

1. Implementar um sistema de notificações em tempo real
2. Adicionar opções de personalização visual para notificações
3. Melhorar a acessibilidade dos componentes (ARIA, contrastes)
4. Expandir o visualizador de PDF com mais recursos (busca, anotações)
5. Adicionar feedback tátil/sonoro para notificações em dispositivos móveis
6. Implementar um histórico de notificações consultável pelo usuário
