# 📋 Documentação Completa do Formulário ZeroHum

## 🎯 Visão Geral

O formulário ZeroHum é um **sistema de pedidos multi-etapas avançado** projetado para a Casa da Gráfica, permitindo que a escola ZeroHum submeta pedidos de materiais gráficos de forma intuitiva e segura. O sistema integra **autenticação por cookies HTTPOnly**, **upload seguro para Google Drive**, **loading bloqueante** e **validação robusta**.

## 🏗️ Arquitetura do Sistema

### **Estrutura de Arquivos**
```
src/pages/formularios/
  └── ZeroHum.jsx                      # Componente principal
src/components/formularios/zerohum/
  ├── MetodoPedido.jsx                 # Etapa 1: Método do pedido
  ├── UploadPDF.jsx                    # Etapa 2: Upload de arquivos
  ├── InformacoesTrabalhho.jsx         # Etapa 3: Informações do trabalho
  ├── Especificacoes.jsx               # Etapa 4: Especificações técnicas
  ├── EscolasQuantidades.jsx           # Etapa 5: Escolas e quantidades
  └── DadosContato.jsx                 # Etapa 6: Dados de contato
src/components/common/
  └── LoadingOverlay.jsx               # Sistema de loading bloqueante
src/hooks/
  └── useFormLoading.js                # Hook para gerenciamento de loading
src/services/
  └── formularioService.js             # Serviços de API
```

## 🔄 Fluxo Completo do Formulário

### **Etapa 1: Método do Pedido**
- **Componente:** `MetodoPedido.jsx`
- **Função:** Selecionar como os dados serão enviados
- **Opções:**
  - `manual`: Inserção manual de escolas e quantidades
  - `excel`: Upload de planilha Excel com dados

```jsx
// Estado gerenciado
formData.metodoPedido // 'manual' | 'excel'
```

## 🎭 Sistema de Loading Bloqueante

### **Componente LoadingOverlay**

Sistema de loading profissional que **bloqueia toda a interface** durante o processamento do formulário, impedindo navegação acidental e fornecendo feedback visual em tempo real.

```jsx
// components/common/LoadingOverlay.jsx
<LoadingOverlay 
  isLoading={isLoading}
  message={loadingMessage}
  submessage={loadingSubmessage}
  progress={progress}
  showProgress={true}
  variant="professional" // Animações avançadas
/>
```

### **Hook useFormLoading**

Hook especializado para gerenciar estados de loading complexos:

```javascript
// hooks/useFormLoading.js
const {
  isLoading,
  loadingMessage,
  loadingSubmessage,
  progress,
  withProgressLoading,
  resetLoading
} = useFormLoading();

// Uso com callbacks de progresso
await withProgressLoading(async (updateProgress, updateStatus) => {
  const result = await submitFormulario(
    formData, 
    pdfFiles, 
    updateProgress, 
    updateStatus
  );
});
```

### **Recursos do Sistema de Loading**

1. **Bloqueio Completo de Interface**
   - Overlay transparente cobrindo toda a tela
   - Previne cliques e interações
   - Z-index elevado (999999)

2. **Prevenção de Navegação**
   - Bloqueia F5 e Ctrl+R
   - Previne uso do botão voltar
   - Aviso ao tentar sair da página

3. **Animações Profissionais**
   ```css
   .spinner-ring { 
     animation: spinRing 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite; 
   }
   .loading-content { 
     animation: fadeInScale 0.5s ease-out; 
   }
   .progress-bar-fill { 
     animation: shimmer 2s infinite; 
   }
   ```

4. **Barra de Progresso em Tempo Real**
   - Progresso de 0-100%
   - Status dinâmico por etapa
   - Submensagens informativas

5. **Feedback Visual Avançado**
   - Efeito blur no fundo
   - Gradientes animados
   - Transições suaves

### **Etapa 2: Upload de PDFs**
- **Componente:** `UploadPDF.jsx`
- **Função:** Upload de arquivos PDF para impressão
- **Validações:**
  - Apenas arquivos PDF
  - Tamanho máximo por arquivo
  - Pelo menos 1 arquivo obrigatório

```jsx
// Estrutura dos PDFs
formData.pdfs = [
  {
    file: File,           // Objeto File do browser
    name: string,         // Nome do arquivo
    size: number,         // Tamanho em bytes
    preview: string       // URL para preview
  }
]
```

### **Etapa 3: Informações do Trabalho**
- **Componente:** `InformacoesTrabalhho.jsx`
- **Dados coletados:**
  - Título do trabalho
  - Data de entrega
  - Observações (opcional)

### **Etapa 4: Especificações Técnicas**
- **Componente:** `Especificacoes.jsx`
- **Configurações:**
  - Formato final (A4, A3, etc.)
  - Cor de impressão (P&B, Colorida)
  - Tipo de impressão (Frente, Frente/Verso)
  - Gramatura do papel
  - Quantidade de grampos

### **Etapa 5: Escolas e Quantidades**
- **Componente:** `EscolasQuantidades.jsx`
- **Comportamento dinâmico:**
  - Se `metodoPedido === 'manual'`: Interface para adicionar escolas manualmente
  - Se `metodoPedido === 'excel'`: Preview dos dados importados do Excel

```jsx
// Estrutura das escolas
formData.escolasQuantidades = {
  "ITABORAI": 34,
  "QUEIMADOS": 54,
  "MARICA": 12
}
```

### **Etapa 6: Dados de Contato**
- **Componente:** `DadosContato.jsx`
- **Dados:** Nome e email (pré-preenchidos do contexto de autenticação)
- **Ação:** Botão de envio final

## 🔐 Sistema de Autenticação e Segurança

### **Autenticação por Cookies HTTPOnly**
```jsx
// Configuração automática nos requests
credentials: 'include'  // Envia cookies automaticamente

// O usuário ZeroHum é redirecionado automaticamente para seu formulário
// Não há acesso a formulários de outras escolas
```

### **Controle de Acesso**
```jsx
// Verificação de permissões
const { user, hasPermission } = useAuth();

// ZeroHum só acessa seu próprio formulário
if (!hasPermission('zerohum') && !hasPermission('all')) {
  // Redirecionamento automático
}
```

## ⚡ Sistema de Loading Bloqueante

### **Componente LoadingOverlay**
```jsx
import LoadingOverlay from '../../components/common/LoadingOverlay';
import useFormLoading from '../../hooks/useFormLoading';

function ZeroHum() {
  const {
    isLoading,
    loadingMessage,
    progress,
    withProgressLoading
  } = useFormLoading();

  const handleSubmit = async () => {
    await withProgressLoading(async (updateProgress, updateStatus) => {
      const result = await submitFormulario(
        formData, 
        pdfFiles, 
        updateProgress, 
        updateStatus
      );
    });
  };

  return (
    <>
      {isLoading && (
        <LoadingOverlay 
          isLoading={isLoading}
          message={loadingMessage}
          progress={progress}
          showProgress={true}
        />
      )}
      {/* Resto do componente */}
    </>
  );
}
```

### **Funcionalidades do Loading**
- ✅ **Tela completamente bloqueada** durante processamento
- ✅ **Barra de progresso** em tempo real (0-100%)
- ✅ **Mensagens dinâmicas** de status
- ✅ **Prevenção de navegação** (F5, Ctrl+R, botão voltar)
- ✅ **Animações suaves** e profissionais
- ✅ **Responsivo** para todos os dispositivos

## 📤 Envio e Processamento

### **Fluxo de Envio**
```jsx
// 1. Validação de dados (5-10%)
onStatusUpdate?.('Validando dados do formulário...');

// 2. Processamento de PDFs (10-30%)
onStatusUpdate?.('Processando arquivos PDF...');
// Conversão para base64 para envio seguro

// 3. Envio para servidor (30-70%)
onStatusUpdate?.('Enviando dados para o servidor...');
// POST /api/formularios com cookies de autenticação

// 4. Processamento no backend (70-90%)
onStatusUpdate?.('Processando resposta do servidor...');
// Salvamento no SQLite + Upload para Google Drive

// 5. Finalização (90-100%)
onStatusUpdate?.('Formulário enviado com sucesso!');
```

### **Estrutura de Dados Enviados**
```json
{
  "metodoPedido": "excel",
  "titulo": "Material para Prova Final",
  "dataEntrega": "2025-06-15",
  "observacoes": "Urgente - entregar até 8h",
  "formatoFinal": "A4",
  "corImpressao": "Preto e Branco",
  "impressao": "Só Frente",
  "gramatura": "75g",
  "grampos": "2",
  "nome": "Coordenação ZeroHum",
  "email": "zerohum@casadagrafica.com",
  "origemDados": "excel",
  "pdfs": [
    {
      "nome": "prova-matematica.pdf",
      "tamanho": 245760,
      "tipo": "application/pdf",
      "base64": "JVBERi0xLjQKJcfs..."
    }
  ],
  "escolasQuantidades": {
    "ITABORAI": 34,
    "QUEIMADOS": 54,
    "MARICA": 12
  }
}
```

## 🔧 Estados e Gerenciamento

### **Estado Principal**
```jsx
const [formData, setFormData] = useState({
  metodoPedido: '',           // 'manual' | 'excel'
  pdfs: [],                   // Array de arquivos PDF
  titulo: '',                 // Título do trabalho
  dataEntrega: '',            // Data de entrega (YYYY-MM-DD)
  observacoes: '',            // Observações opcionais
  formatoFinal: 'A4',         // Formato padrão
  corImpressao: 'Preto e Branco',
  impressao: 'Só Frente',
  gramatura: '75g',
  grampos: '0',
  escolasQuantidades: {},     // {escola: quantidade}
  arquivoExcel: null,         // Arquivo Excel (se método excel)
  nome: user?.username || '', // Pré-preenchido
  email: user?.email || ''    // Pré-preenchido
});
```

### **Navegação Entre Etapas**
```jsx
const [step, setStep] = useState(1);

const handleNext = () => setStep(prev => prev + 1);
const handleBack = () => setStep(prev => prev - 1);

// Validação antes de avançar
const canProceed = validateCurrentStep(step, formData);
```

## 🎨 Interface e UX

### **Design System**
- **Cores:** Gradiente verde/azul para ZeroHum
- **Layout:** Responsivo com Tailwind CSS
- **Animações:** Transições suaves entre etapas
- **Feedback:** Notificações toast para sucesso/erro

### **Componentes Reutilizáveis**
- `ProgressBar`: Barra de progresso das etapas
- `Notification`: Sistema de notificações
- `LoadingOverlay`: Overlay de loading bloqueante

## 🚀 Performance e Otimizações

### **Lazy Loading**
```jsx
// Componentes carregados sob demanda
const ZeroHum = lazy(() => import('../pages/formularios/ZeroHum'));
```

### **Memoização**
```jsx
// Prevenção de re-renders desnecessários
const memoizedSteps = useMemo(() => steps, []);
```

### **Debounce em Inputs**
```jsx
// Evita validações excessivas durante digitação
const debouncedValidation = useDebounce(formData, 300);
```

## 🐛 Tratamento de Erros

### **Validação Frontend**
- Campos obrigatórios
- Formato de dados
- Tamanho de arquivos
- Tipos de arquivo permitidos

### **Tratamento de Erros de Rede**
```jsx
try {
  const result = await submitFormulario(...);
} catch (error) {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    setNotification({
      type: 'error',
      message: 'Erro de conexão. Verifique sua internet.'
    });
  }
}
```

## 📱 Responsividade

### **Breakpoints**
- **Mobile:** < 768px - Layout em coluna única
- **Tablet:** 768px - 1024px - Layout adaptado
- **Desktop:** > 1024px - Layout completo

### **Otimizações Mobile**
- Botões com tamanho adequado para touch
- Inputs otimizados para teclados móveis
- Scrolling suave e navegação intuitiva

---

## 🔧 Manutenção e Atualizações

### **Adicionando Novas Funcionalidades**
1. Criar novo componente em `src/components/formularios/zerohum/`
2. Adicionar à sequência de etapas
3. Atualizar validações
4. Testar fluxo completo

### **Logs e Debug**
```jsx
// Logs detalhados para desenvolvimento
console.log('Estado dos PDFs:', formData.pdfs);
console.log('Dados preparados:', preparedData);
```

Este sistema é **altamente escalável** e pode ser facilmente replicado para outras escolas mantendo a mesma estrutura e funcionalidades! 🚀
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
