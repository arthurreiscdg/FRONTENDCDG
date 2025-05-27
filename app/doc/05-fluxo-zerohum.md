# Documentação do Fluxo do Formulário ZeroHum

## Visão Geral

O formulário ZeroHum é uma das principais funcionalidades do sistema CDG, projetado para coletar informações detalhadas sobre trabalhos de impressão a serem realizados. O formulário segue um fluxo estruturado em seis etapas sequenciais, cada uma coletando um conjunto específico de dados necessários para processar o pedido.

## Estrutura de Arquivos

```
src/
  components/
    formularios/
      zerohum/
        DadosContato.jsx
        EscolasQuantidades.jsx
        Especificacoes.jsx
        InformacoesTrabalhho.jsx
        MetodoPedido.jsx
        UploadPDF.jsx
  pages/
    formularios/
      ZeroHum.jsx
```

## Componente Principal (ZeroHum.jsx)

O arquivo `src/pages/formularios/ZeroHum.jsx` é o componente principal que orquestra todo o fluxo do formulário.

**Estado principal:**
```jsx
const [step, setStep] = useState(1);
const [notification, setNotification] = useState(null);
const [loading, setLoading] = useState(false);
const [showDataModal, setShowDataModal] = useState(false);
const [apiData, setApiData] = useState(null);
const [formData, setFormData] = useState({
  metodoPedido: '',
  pdfs: [],
  titulo: '',
  dataEntrega: '',
  observacoes: '',
  formatoFinal: 'A4',
  corImpressao: 'Preto e Branco',
  impressao: 'Só Frente',
  gramatura: '75g',
  grampos: '0',
  escolasQuantidades: {},
  arquivoExcel: null,
  nome: user?.username || '',
  email: user?.email || ''
});
```

**Definição das etapas:**
```jsx
const steps = [
  { number: 1, title: "Método de pedido" },
  { number: 2, title: "Upload de PDF" },
  { number: 3, title: "Informações do Trabalho" },
  { number: 4, title: "Especificações" },
  { number: 5, title: formData.metodoPedido === 'manual' ? "Escolas" : "Excel" },
  { number: 6, title: "Dados de Contato" }
];
```

**Funções principais:**
- `handleNext()`: Avança para a próxima etapa
- `handleBack()`: Retorna para a etapa anterior
- `updateFormData()`: Atualiza o estado do formulário
- `handleSubmit()`: Processa o envio final do formulário
- `renderStep()`: Renderiza o componente correspondente à etapa atual

## Fluxo Detalhado por Etapa

### Etapa 1: Método de Pedido (MetodoPedido.jsx)

**Propósito:**
Determinar como o usuário deseja especificar as quantidades para cada escola.

**Opções:**
- Manual: Inserção individual de quantidades para cada escola
- Excel: Upload de arquivo Excel contendo as quantidades

**Validações:**
- Obrigatório selecionar um método antes de continuar

**Estado e Props:**
```jsx
function MetodoPedido({ formData, updateFormData, onNext }) {
  const [error, setError] = useState('');
  
  // Funções de manipulação
  const handleMetodoChange = (metodo) => {...};
  const handleContinue = () => {...};
}
```

### Etapa 2: Upload de PDF (UploadPDF.jsx)

**Propósito:**
Permitir o upload dos documentos PDF que serão impressos.

**Funcionalidades:**
- Arrastar e soltar arquivos (drag and drop)
- Seleção via diálogo de arquivo
- Visualização prévia de PDFs
- Remoção de arquivos da lista

**Validações:**
- Pelo menos um arquivo PDF deve ser anexado
- Verificação de formato de arquivo (somente PDF)
- Tamanho máximo de arquivo

**Estado e Props:**
```jsx
function UploadPDF({ formData, updateFormData, onNext, onBack }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [previewPdf, setPreviewPdf] = useState(null);
  const fileInputRef = useRef(null);
  
  // Funções de manipulação
  const handleDrag = (e) => {...};
  const handleDrop = (e) => {...};
  const handleFileChange = (e) => {...};
  const handleFiles = (fileList) => {...};
  const removeFile = (id) => {...};
  const handlePreview = (pdf) => {...};
  const closePreview = () => {...};
  const handleContinue = () => {...};
  const formatFileSize = (bytes) => {...};
}
```

### Etapa 3: Informações do Trabalho (InformacoesTrabalhho.jsx)

**Propósito:**
Coletar informações gerais sobre o trabalho de impressão.

**Campos:**
- Título do trabalho
- Data de entrega
- Observações (opcional)

**Validações:**
- Título obrigatório
- Data de entrega obrigatória e não pode ser anterior à data atual

**Estado e Props:**
```jsx
function InformacoesTrabalhho({ formData, updateFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({
    titulo: '',
    dataEntrega: ''
  });
  
  // Funções de manipulação
  const handleInputChange = (field, value) => {...};
  const validateForm = () => {...};
  const handleContinue = () => {...};
  
  // Data mínima permitida (hoje)
  const today = new Date().toISOString().split('T')[0];
}
```

### Etapa 4: Especificações (Especificacoes.jsx)

**Propósito:**
Definir as especificações técnicas de impressão.

**Campos:**
- Formato final (A4, A3, A2, A1)
- Cores de impressão (Preto e Branco, Colorido)
- Modo de impressão (Só Frente, Frente e Verso)
- Gramatura do papel (75g, 90g, 120g, 150g)
- Quantidade de grampos (0, 1, 2)

**Validações:**
- Todos os campos possuem valores padrão, sem validações obrigatórias

**Estado e Props:**
```jsx
function Especificacoes({ formData, updateFormData, onNext, onBack }) {
  const formatosDisponiveis = ['A4', 'A3', 'A2', 'A1'];
  const coresDisponiveis = ['Preto e Branco', 'Colorido'];
  const impressaoOpcoes = ['Só Frente', 'Frente e Verso'];
  const gramaturaOpcoes = ['75g', '90g', '120g', '150g'];
  const gramposOpcoes = ['0', '1', '2'];
  
  const handleInputChange = (field, value) => {...};
}
```

### Etapa 5: Escolas e Quantidades (EscolasQuantidades.jsx)

**Propósito:**
Especificar as quantidades de impressão para cada escola.

**Funcionalidades:**
- Lista completa de escolas ZeroHum
- Campo para definir a quantidade para cada escola
- Alternativa para upload de arquivo Excel

**Validações:**
- Pelo menos uma escola deve ter quantidade maior que zero
- OU deve haver um arquivo Excel anexado (dependendo do método escolhido)

**Estado e Props:**
```jsx
function EscolasQuantidades({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  // Lista de escolas
  const escolas = [
    'ARARUAMA', 'CABO_FRIO', 'ITABORAI', /* ... outras escolas ... */
  ];
  
  // Funções de manipulação
  const handleQuantidadeChange = (escola, quantidade) => {...};
  const handleFileChange = (e) => {...};
  const handleContinue = () => {...};
}
```

### Etapa 6: Dados de Contato (DadosContato.jsx)

**Propósito:**
Coletar informações de contato do solicitante e concluir o processo.

**Campos:**
- Nome do solicitante
- Email para contato
- Concordância com termos

**Validações:**
- Nome obrigatório
- Email obrigatório e em formato válido
- Concordância com termos obrigatória

**Estado e Props:**
```jsx
function DadosContato({ formData, updateFormData, onBack, onSubmit, loading }) {
  const [errors, setErrors] = useState({
    nome: '',
    email: ''
  });
  const [concordaTermos, setConcordaTermos] = useState(false);
  const [termoError, setTermoError] = useState('');
  
  // Funções de manipulação
  const handleInputChange = (field, value) => {...};
  const validateForm = () => {...};
  const handleConcluir = () => {...};
}
```

## Fluxo de Dados

### Passagem de Dados entre Componentes

O fluxo de dados entre os componentes das etapas é consistente e segue um padrão definido:

1. O componente principal (`ZeroHum.jsx`) mantém todo o estado do formulário no objeto `formData`
2. Cada componente de etapa recebe via props:
   - `formData`: O estado atual do formulário
   - `updateFormData`: Função para atualizar o estado
   - `onNext`: Função para avançar para a próxima etapa
   - `onBack`: Função para retornar à etapa anterior
   - `onSubmit`: Função para envio final (apenas na última etapa)
   - `loading`: Status de operação em andamento (apenas na última etapa)

### Persistência de Dados

O estado do formulário é mantido na memória durante toda a sessão de preenchimento:
- Não há persistência entre sessões ou salvamento automático
- Os dados são perdidos se o usuário atualizar a página ou sair do formulário

## Validações

Cada etapa implementa suas próprias validações:

1. **Método de Pedido**: Obrigatório selecionar um método
2. **Upload de PDF**: Pelo menos um PDF deve ser anexado
3. **Informações do Trabalho**: Título obrigatório, data de entrega válida
4. **Especificações**: Sem validações obrigatórias (todos têm valores padrão)
5. **Escolas e Quantidades**: Pelo menos uma escola com quantidade ou arquivo Excel
6. **Dados de Contato**: Nome e email válidos, concordância com termos

## Submissão do Formulário

O processo de submissão é executado na função `handleSubmit()` do componente ZeroHum:
- Coleta todos os dados do estado `formData`
- Formata os dados conforme necessário para a API
- Envia os dados para o servidor
- Exibe notificação de sucesso ou erro
- Redireciona ou limpa o formulário após sucesso

## Oportunidades de Melhorias

1. Implementar salvamento automático de formulários parciais
2. Adicionar visualização completa do formulário antes do envio final
3. Implementar um sistema de acompanhamento do status da solicitação após envio
4. Adicionar opção para duplicar formulários anteriores
5. Implementar histórico de formulários enviados por usuário
6. Melhorar a validação de arquivos (tamanho, qualidade, dimensões)
