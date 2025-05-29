# 📱 Sistema Montink - Interface Frontend

## 🎯 Visão Geral

O **Sistema Montink Frontend** oferece uma interface moderna e responsiva para gerenciamento de pedidos externos. Construído em React, utiliza componentização modular, integração com APIs REST, e uma experiência de usuário otimizada para operações de visualização, filtros e alteração de status de pedidos.

## 🏗️ Arquitetura de Componentes

### **Estrutura Modular**

```
src/
├── pages/
│   └── Montink.jsx              # Página principal
├── components/montink/
│   ├── ActionsPanel.jsx         # Painel de ações
│   ├── FilterPanel.jsx          # Painel de filtros
│   ├── OrdersTable.jsx          # Tabela de pedidos
│   ├── OrderActionsBar.jsx      # Barra de ações em lote
│   ├── OrderDetailsModal.jsx    # Modal de detalhes
│   └── ChangeStatusModal.jsx    # Modal de alteração de status
└── services/
    └── montinkService.js        # Serviço de API
```

## 📄 Componentes Principais

### **1. Montink.jsx (Página Principal)**

**Responsabilidades:**
- 🎮 Orquestração de todos os componentes filhos
- 🔄 Gerenciamento de estados globais (pedidos, filtros, paginação)
- 🌐 Integração com serviços de API
- 🔐 Controle de permissões de usuário
- 📊 Coordenação de operações assíncronas

**Estados Gerenciados:**
```javascript
// Estados principais
const [orders, setOrders] = useState([]);           // Lista de pedidos
const [selectedOrders, setSelectedOrders] = useState([]); // Selecionados
const [statusOptions, setStatusOptions] = useState([]); // Status disponíveis
const [loading, setLoading] = useState(true);      // Estado de carregamento

// Paginação
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalOrders, setTotalOrders] = useState(0);

// Filtros e modais
const [activeFilters, setActiveFilters] = useState({});
const [showDetailsModal, setShowDetailsModal] = useState(false);
const [showStatusModal, setShowStatusModal] = useState(false);
```

**Funcionalidades Implementadas:**
- ✅ Carregamento paginado de pedidos com filtros
- ✅ Seleção múltipla para operações em lote
- ✅ Navegação entre páginas
- ✅ Aplicação de filtros dinâmicos
- ✅ Gerenciamento de modais

### **2. OrdersTable.jsx (Tabela de Pedidos)**

**Características:**
- 📱 **Responsividade Total:** Adaptação automática para dispositivos móveis
- ✅ **Seleção Múltipla:** Checkboxes individuais e seleção geral
- 🎨 **Indicadores Visuais:** Status com cores CSS personalizadas
- 📊 **Formatação de Dados:** Datas, valores monetários e estados

**Layout Responsivo:**
```javascript
// Desktop: Tabela completa
// Mobile: Cards compactos com informações essenciais
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

React.useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

**Colunas Exibidas:**
- **Seleção:** Checkbox para operações em lote
- **ID/Número:** Identificação única do pedido
- **Cliente:** Nome do cliente/destinatário
- **Produto:** SKU e nome do produto
- **Valor:** Valor total formatado (R$)
- **Status:** Badge colorido com status atual
- **Data:** Data de criação formatada
- **Ações:** Botões de visualizar e editar

### **3. FilterPanel.jsx (Painel de Filtros)**

**Filtros Disponíveis:**
```javascript
const filtrosSuportados = {
  status: 'Filtro por status do pedido',
  sku: 'Busca por SKU do produto',
  dataEmissao: 'Filtro por data de emissão',
  numeroPedido: 'Busca por número do pedido',
  nomeCliente: 'Busca por nome do cliente'
};
```

**Funcionalidades:**
- 🔍 Busca em tempo real com debounce
- 📅 Seletor de datas integrado
- 🎛️ Dropdown de status com cores
- 🧹 Botão de limpar filtros
- 💾 Persistência de filtros durante navegação

### **4. OrderDetailsModal.jsx (Modal de Detalhes)**

**Abas Implementadas:**
- **📋 Visão Geral:** Informações básicas do pedido
- **📦 Produto:** Detalhes técnicos e arquivos
- **📍 Entrega:** Endereço e informações de entrega
- **📈 Timeline:** Histórico completo de mudanças de status

**Histórico de Status:**
```javascript
const loadOrderHistory = async () => {
  setLoadingHistory(true);
  try {
    const history = await montinkService.getPedidoHistory(order.id);
    setOrderHistory(history);
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
  } finally {
    setLoadingHistory(false);
  }
};
```

**Timeline Visual:**
- 🕐 Cronologia de mudanças
- 👤 Usuário responsável por cada alteração
- 📝 Observações detalhadas
- 🎨 Status anterior e novo com cores

### **5. ChangeStatusModal.jsx (Modal de Alteração)**

**Modos de Operação:**
- **Individual:** Alteração de um pedido específico
- **Lote:** Alteração múltipla com confirmação

**Validações Implementadas:**
```javascript
const handleConfirm = async () => {
  if (!selectedStatus) {
    setError('Selecione um status válido');
    return;
  }
  
  setLoading(true);
  try {
    if (mode === 'single') {
      await montinkService.updatePedidoStatus(order.id, selectedStatus);
    } else {
      await montinkService.updateMultiplePedidosStatus(orderIds, selectedStatus);
    }
    onConfirm(selectedStatus);
  } catch (error) {
    setError(`Erro ao atualizar status: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
```

### **6. ActionsPanel.jsx (Painel de Ações)**

**Ações Disponíveis:**
- 🔄 Recarregar dados
- 📥 Download de PDF (implementação futura)
- ⚙️ Configurações de exibição
- 📊 Exportar relatórios (placeholder)

### **7. OrderActionsBar.jsx (Barra de Ações em Lote)**

**Visibilidade Condicional:**
```javascript
// Exibe apenas quando há pedidos selecionados
{selectedOrders.length > 0 && (
  <OrderActionsBar 
    selectedCount={selectedOrders.length}
    onChangeStatus={handleBulkStatusChange}
    onClearSelection={() => setSelectedOrders([])}
  />
)}
```

**Ações em Lote:**
- 📝 Alterar status de múltiplos pedidos
- 🧹 Limpar seleção
- 📄 Gerar PDF conjunto (futuro)

## 🌐 Integração com API

### **montinkService.js (Serviço de Comunicação)**

**Métodos Implementados:**
```javascript
export const montinkService = {
  // Busca paginada com filtros
  async getPedidos(filters = {}, page = 1, limit = 15) { ... },
  
  // Lista status disponíveis
  async getStatusOptions() { ... },
  
  // Atualização individual
  async updatePedidoStatus(id, statusId) { ... },
  
  // Atualização em lote
  async updateMultiplePedidosStatus(orderIds, statusId) { ... },
  
  // Histórico de pedido
  async getPedidoHistory(id) { ... },
  
  // Download de PDF (futuro)
  async downloadPedidosPDF(orderIds) { ... }
};
```

**Configuração de Requisições:**
```javascript
const response = await fetch(`${API_URL}/pedidos`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' // Cookies de autenticação
});
```

**Tratamento de Erros:**
```javascript
if (!response.ok) {
  const error = await response.json();
  throw new Error(error.mensagem || 'Erro na requisição');
}
```

## 📱 Design Responsivo

### **Breakpoints Implementados**

```css
/* Mobile First Design */
@media (max-width: 768px) {
  .orders-table {
    display: none; /* Oculta tabela */
  }
  
  .orders-cards {
    display: block; /* Exibe cards */
  }
}

@media (min-width: 769px) {
  .orders-table {
    display: table; /* Exibe tabela */
  }
  
  .orders-cards {
    display: none; /* Oculta cards */
  }
}
```

### **Adaptações por Dispositivo**

**Desktop (>768px):**
- 📊 Tabela completa com todas as colunas
- 🖱️ Hover effects e tooltips
- ⌨️ Navegação por teclado
- 🎛️ Filtros expandidos

**Tablet (768px - 1024px):**
- 📊 Tabela adaptada com colunas essenciais
- 👆 Touch-friendly buttons
- 📱 Modais em tela cheia

**Mobile (<768px):**
- 🃏 Layout em cards
- 👆 Gestos de swipe
- 📱 Navigation bottom sheet
- 🔍 Filtros em modal

## 🎨 Sistema de Temas e Estilos

### **Variáveis CSS Principais**
```css
:root {
  /* Cores primárias */
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  
  /* Tema escuro */
  --bg-primary: #1f2937;
  --bg-secondary: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### **Status Colors**
```javascript
const statusColors = {
  1: '#f59e0b',  // Aguardando - Amarelo
  2: '#10b981',  // Aprovado - Verde
  3: '#3b82f6',  // Em Produção - Azul
  4: '#8b5cf6',  // Revisão - Roxo
  5: '#ef4444',  // Cancelado - Vermelho
  6: '#06b6d4',  // Enviado - Ciano
  7: '#84cc16',  // Entregue - Verde claro
  8: '#f97316',  // Pendente - Laranja
  9: '#6b7280'   // Arquivado - Cinza
};
```

## 🔄 Gerenciamento de Estado

### **Estados Locais por Componente**

**Montink.jsx (Estado Global):**
```javascript
const [orders, setOrders] = useState([]);
const [selectedOrders, setSelectedOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [activeFilters, setActiveFilters] = useState({});
const [currentPage, setCurrentPage] = useState(1);
```

**OrderDetailsModal.jsx (Estado Local):**
```javascript
const [activeTab, setActiveTab] = useState('overview');
const [orderHistory, setOrderHistory] = useState([]);
const [loadingHistory, setLoadingHistory] = useState(false);
```

**FilterPanel.jsx (Estado Local):**
```javascript
const [localFilters, setLocalFilters] = useState({});
const [isExpanded, setIsExpanded] = useState(false);
```

### **Fluxo de Dados**

```
[API] → montinkService → Montink.jsx → Componentes Filhos
  ↑                                          ↓
[Backend]                              [User Interactions]
```

## ⚡ Performance e Otimizações

### **Lazy Loading Implementado**
```javascript
// Carregamento sob demanda do histórico
useEffect(() => {
  if (isOpen && order && activeTab === 'timeline') {
    loadOrderHistory();
  }
}, [isOpen, order, activeTab]);
```

### **Debounce em Filtros**
```javascript
// Evita múltiplas requisições durante digitação
const debouncedFilter = useCallback(
  debounce((filters) => {
    loadOrders(1, filters);
  }, 500),
  []
);
```

### **Memoização de Componentes**
```javascript
// Evita re-renderizações desnecessárias
const MemoizedOrderRow = React.memo(OrderRow);
const MemoizedFilterPanel = React.memo(FilterPanel);
```

### **Paginação Eficiente**
```javascript
// Carrega apenas itens da página atual
const loadOrders = async (page = 1, filters = {}) => {
  const limit = 15; // Limite fixo por página
  const data = await montinkService.getPedidos(filters, page, limit);
  // Substitui lista completa, não concatena
  setOrders(data.pedidos);
};
```

## 🔐 Controle de Acesso e Permissões

### **Verificação de Permissões**
```javascript
const { user, hasPermission } = useAuth();

// Verifica se usuário pode alterar status
const canChangeStatus = hasPermission('montink.status.update');

// Verifica se usuário pode ver detalhes
const canViewDetails = hasPermission('montink.orders.view');
```

### **Filtragem por Usuário**
```javascript
// Backend automaticamente filtra pedidos por usuário não-admin
// Frontend apenas exibe dados retornados pela API
const loadOrders = async () => {
  // API já aplica filtro de usuário no backend
  const data = await montinkService.getPedidos(activeFilters, currentPage);
  setOrders(data.pedidos);
};
```

## 📞 Tratamento de Erros

### **Estratégias Implementadas**

**Erro de Rede:**
```javascript
try {
  const data = await montinkService.getPedidos();
  setOrders(data.pedidos);
} catch (error) {
  if (error.name === 'NetworkError') {
    setError('Erro de conexão. Verifique sua internet.');
  } else {
    setError(`Erro ao carregar pedidos: ${error.message}`);
  }
}
```

**Erro de Autorização:**
```javascript
// Redirecionamento automático em caso de 401
if (response.status === 401) {
  logout(); // Limpa sessão
  navigate('/login'); // Redireciona
  return;
}
```

**Fallbacks de Interface:**
```javascript
// Exibe mensagem quando não há pedidos
{orders.length === 0 && !loading && (
  <div className="empty-state">
    <p>Nenhum pedido encontrado</p>
    <button onClick={() => setActiveFilters({})}>
      Limpar Filtros
    </button>
  </div>
)}
```

## 🧪 Estados de Loading

### **Indicadores Visuais**

**Loading Principal:**
```javascript
{loading && (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Carregando pedidos...</p>
  </div>
)}
```

**Loading em Operações:**
```javascript
<button 
  disabled={updating} 
  onClick={handleStatusChange}
>
  {updating ? (
    <>
      <Spinner size="sm" />
      Atualizando...
    </>
  ) : (
    'Alterar Status'
  )}
</button>
```

**Loading de Histórico:**
```javascript
{loadingHistory ? (
  <SkeletonLoader lines={5} />
) : (
  <Timeline data={orderHistory} />
)}
```

## 🔄 Ciclo de Vida dos Componentes

### **Montink.jsx (Componente Principal)**
```javascript
useEffect(() => {
  // Inicialização: carrega dados essenciais
  initializeData();
}, []);

useEffect(() => {
  // Reação a mudanças: recarrega quando filtros mudam
  loadOrders(1, activeFilters);
}, [activeFilters]);

useEffect(() => {
  // Navegação: recarrega quando página muda
  loadOrders(currentPage, activeFilters);
}, [currentPage]);
```

### **OrderDetailsModal.jsx (Modal de Detalhes)**
```javascript
useEffect(() => {
  // Carregamento condicional: só carrega histórico quando necessário
  if (isOpen && order && activeTab === 'timeline') {
    loadOrderHistory();
  }
}, [isOpen, order, activeTab]);

useEffect(() => {
  // Cleanup: limpa dados ao fechar modal
  if (!isOpen) {
    setOrderHistory([]);
    setActiveTab('overview');
  }
}, [isOpen]);
```

## 🚀 Funcionalidades Futuras Planejadas

### **Expansões Técnicas**
- 🔄 **WebSocket:** Atualizações em tempo real
- 📱 **PWA:** Funcionamento offline
- 🎯 **Push Notifications:** Alertas de mudança de status
- 📊 **Charts:** Gráficos de dashboard
- 🔍 **Search Avançado:** Filtros mais granulares

### **Melhorias de UX**
- 🎨 **Tema Claro:** Toggle de tema
- ⌨️ **Atalhos de Teclado:** Navegação rápida
- 🗂️ **Salvamento de Filtros:** Presets personalizados
- 📱 **Gestos Touch:** Swipe para ações
- 🔊 **Feedback Sonoro:** Confirmações audíveis

### **Novas Funcionalidades**
- 📄 **Geração de PDF Real:** Relatórios customizados
- 📧 **Notificações por Email:** Alertas automáticos
- 📈 **Analytics:** Métricas de performance
- 🏷️ **Tags Customizáveis:** Categorização livre
- 💬 **Chat Interno:** Comunicação sobre pedidos

## 📋 Checklist de Implementação Frontend

### **Componentes Base** ✅
- [x] Página principal Montink
- [x] Tabela responsiva de pedidos
- [x] Painel de filtros dinâmicos
- [x] Modal de detalhes completo
- [x] Modal de alteração de status
- [x] Painel de ações em lote

### **Integrações** ✅
- [x] Serviço de API completo
- [x] Autenticação e permissões
- [x] Paginação e filtros
- [x] Tratamento de erros
- [x] Loading states

### **Responsividade** ✅
- [x] Layout desktop otimizado
- [x] Adaptação para tablet
- [x] Interface mobile friendly
- [x] Navegação touch

### **Próximos Passos** 🔄
- [ ] Testes automatizados (Jest/Testing Library)
- [ ] Documentação de componentes (Storybook)
- [ ] Otimização de bundle (Code splitting)
- [ ] Métricas de performance (Web Vitals)
- [ ] Implementação de PWA

---

**Sistema Montink Frontend**: Interface moderna, responsiva e pronta para produção! 📱
