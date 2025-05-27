# Documentação do Sistema de Formulários

## Visão Geral

O sistema de formulários do CDG System permite que os usuários preencham e enviem diferentes tipos de formulários, cada um com seu próprio fluxo e campos específicos. O principal formulário implementado é o "ZeroHum", que segue um processo de múltiplas etapas para coleta de informações.

## Componentes de Formulário

### FormCard (src/components/FormCard.jsx)

Um componente de card interativo que representa uma opção de formulário disponível para seleção pelo usuário.

**Propriedades:**
- `title`: Título do formulário
- `description`: Descrição curta do formulário
- `icon`: Ícone representativo do formulário
- `path`: Caminho da rota para o formulário
- `onSelect`: Callback chamado quando o usuário seleciona o formulário

**Características:**
- Design responsivo com efeitos de hover
- Transição de cores ao passar o mouse
- Estilo consistente com o tema da aplicação

### ProgressBar (src/components/formularios/ProgressBar.jsx)

Barra de progresso que mostra as etapas do formulário e destaca a etapa atual.

**Propriedades:**
- `currentStep`: Número da etapa atual
- `steps`: Array de objetos representando cada etapa (número e título)

**Características:**
- Indica visualmente o progresso através das etapas
- Marca etapas concluídas com um ícone de verificação
- Conecta visualmente as etapas com uma linha de progresso
- Diferencia etapas ativas, concluídas e futuras por cores

## Formulário ZeroHum (src/pages/formularios/ZeroHum.jsx)

Implementa um formulário multi-etapas para envio de trabalhos no sistema ZeroHum.

**Estado principal:**
- `formData`: Armazena todos os dados coletados nas diferentes etapas do formulário
- `step`: Controla a etapa atual do formulário
- `notification`: Gerencia mensagens de notificação para o usuário
- `loading`: Indica operações assíncronas em andamento

**Etapas do formulário:**
1. **Método de Pedido** (MetodoPedido.jsx)
   - Permite escolher entre inserção manual de dados ou upload de planilha Excel

2. **Upload de PDF** (UploadPDF.jsx)
   - Permite arrastar e soltar ou selecionar arquivos PDF
   - Suporta visualização prévia de PDFs
   - Permite remover arquivos selecionados

3. **Informações do Trabalho** (InformacoesTrabalhho.jsx)
   - Coleta título do trabalho
   - Define data de entrega com validação (não pode ser anterior à data atual)
   - Campo opcional para observações

4. **Especificações** (Especificacoes.jsx)
   - Definição do formato final (A4, A3, A2, A1)
   - Opções de cores de impressão (Preto e Branco, Colorido)
   - Tipo de impressão (Só Frente, Frente e Verso)
   - Seleção de gramatura do papel (75g, 90g, 120g, 150g)
   - Escolha da quantidade de grampos (0, 1, 2)

5. **Escolas e Quantidades** (EscolasQuantidades.jsx)
   - Lista de escolas ZeroHum com campos para definir quantidade por escola
   - Alternativa para upload de arquivo Excel com as informações
   - Depende do método escolhido na etapa 1

6. **Dados de Contato** (DadosContato.jsx)
   - Coleta nome e email do solicitante
   - Confirmação de concordância com termos
   - Botão para concluir o envio do formulário

**Fluxo de dados:**
- Cada componente de etapa recebe `formData` e `updateFormData` via props
- As alterações são propagadas para o componente principal ZeroHum
- Validações são realizadas em cada etapa antes de prosseguir
- O envio final do formulário é feito apenas na última etapa

## Componentes de Etapa do Formulário ZeroHum

### MetodoPedido (src/components/formularios/zerohum/MetodoPedido.jsx)

Permite ao usuário escolher o método de solicitação:
- Manual: inserção direta das escolas e quantidades
- Excel: upload de planilha com as informações

### UploadPDF (src/components/formularios/zerohum/UploadPDF.jsx)

Interface para upload de arquivos PDF com as seguintes características:
- Área de arrastar e soltar (drag and drop)
- Seleção via diálogo de arquivo
- Visualização prévia dos PDFs selecionados
- Remoção de arquivos da lista
- Formatação de tamanho de arquivo para melhor legibilidade

### InformacoesTrabalhho (src/components/formularios/zerohum/InformacoesTrabalhho.jsx)

Coleta informações básicas sobre o trabalho:
- Título do trabalho (obrigatório)
- Data de entrega (obrigatória, com validação de data mínima)
- Campo de observações (opcional)

### Especificacoes (src/components/formularios/zerohum/Especificacoes.jsx)

Permite definir especificações técnicas do trabalho:
- Formato final do documento
- Tipo de impressão (cores)
- Modo de impressão (frente/verso)
- Gramatura do papel
- Quantidade de grampos

### EscolasQuantidades (src/components/formularios/zerohum/EscolasQuantidades.jsx)

Componente para definir a distribuição por escolas:
- Lista de todas as escolas ZeroHum
- Campos para definir quantidade para cada escola
- Alternativa de upload de arquivo Excel

### DadosContato (src/components/formularios/zerohum/DadosContato.jsx)

Finaliza o processo coletando dados do solicitante:
- Nome do solicitante
- Email para contato
- Confirmação de concordância com termos
- Botão para enviar o formulário completo

## Componentes auxiliares

### Notification (src/components/Notification.jsx)

Exibe mensagens de notificação temporárias para o usuário.

**Propriedades:**
- `message`: Texto da mensagem
- `type`: Tipo da notificação (success, error, warning, info)
- `duration`: Duração em milissegundos
- `onClose`: Callback chamado quando a notificação é fechada

### PdfPreviewModal (src/components/PdfPreviewModal.jsx)

Modal para visualização prévia de arquivos PDF.

## Página de Seleção de Formulários (src/pages/Formularios.jsx)

Apresenta as opções de formulários disponíveis para o usuário:
- Coleguium
- Elite
- ZeroHum
- Pensi

**Funcionalidades:**
- Exibe cards para cada tipo de formulário
- Permite selecionar um formulário para iniciar seu preenchimento
- Recupera informações do usuário atual para pré-preenchimento

## Oportunidades de Melhorias

1. Implementar salvamento automático de rascunhos de formulários
2. Adicionar visualização prévia do formulário completo antes do envio final
3. Implementar validação mais robusta de campos em todas as etapas
4. Adicionar suporte para anexar outros tipos de arquivos além de PDF
5. Implementar histórico de formulários enviados pelo usuário
6. Adicionar pesquisa e filtragem na lista de escolas
