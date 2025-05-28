# 🏫 Guia de Escalabilidade: Adicionando Novas Escolas

## 🎯 Visão Geral

O sistema Casa da Gráfica foi projetado com **arquitetura escalável** que permite adicionar **ilimitadas escolas** mantendo **isolamento de dados**, **segurança** e **facilidade de manutenção**. Este guia mostra como é simples adicionar uma nova escola ao sistema.

## ⏱️ Tempo Estimado: 35 minutos total

- ⚙️ **Backend:** 5 minutos
- 🎨 **Frontend:** 30 minutos  
- ✅ **Testes:** Incluído no processo

---

## 🔧 Etapa 1: Backend (5 minutos)

### **1.1 Criar Usuário da Nova Escola**

Execute o script ou adicione via interface admin:

```javascript
// scripts/criarUsuarioEscola.js ou via interface
const novoUsuario = {
  nome: "Apogeu Educacional",
  username: "apogeu",
  email: "contato@apogeu.edu.br",
  senha: "apogeu123", // Será hasheada automaticamente
  role: "escola",
  roles: ["apogeu"], // Permissão específica da escola
  escola_id: 4, // ID único da escola
  is_admin: false,
  is_ativo: true
};

// Inserir no banco
await Usuario.create(novoUsuario);
```

### **1.2 Atualizar Mapeamento de Redirecionamento**

```javascript
// controllers/authController.js
const USER_FORM_MAPPING = {
  'zerohum': '/formularios/zerohum',
  'coleguium': '/formularios/coleguium',
  'elite': '/formularios/elite',
  'pensi': '/formularios/pensi',
  'apogeu': '/formularios/apogeu' // ✅ Adicionar apenas esta linha!
};
```

### **1.3 (Opcional) Pasta no Google Drive**

```javascript
// O sistema cria automaticamente, mas você pode pré-criar:
// Casa da Gráfica/Formulários/2025/05-Maio/Apogeu/
```

✅ **Backend configurado!** O endpoint `/api/formularios` já aceita qualquer escola automaticamente.

---

## 🎨 Etapa 2: Frontend (30 minutos)

### **2.1 Copiar Estrutura Base (2 minutos)**

```powershell
# Copiar componentes do ZeroHum como base
Copy-Item -Recurse "src/components/formularios/zerohum" "src/components/formularios/apogeu"

# Copiar página principal
Copy-Item "src/pages/formularios/ZeroHum.jsx" "src/pages/formularios/Apogeu.jsx"
```

### **2.2 Personalizar Componente Principal (10 minutos)**

```jsx
// src/pages/formularios/Apogeu.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { submitFormulario } from '../../services/formularioService';
import useFormLoading from '../../hooks/useFormLoading';
import LoadingOverlay from '../../components/common/LoadingOverlay';

// Componentes específicos do Apogeu
import MetodoPedido from '../../components/formularios/apogeu/MetodoPedido';
import UploadPDF from '../../components/formularios/apogeu/UploadPDF';
import InformacoesTrabalhho from '../../components/formularios/apogeu/InformacoesTrabalhho';
import Especificacoes from '../../components/formularios/apogeu/Especificacoes';
import EscolasQuantidades from '../../components/formularios/apogeu/EscolasQuantidades';
import DadosContato from '../../components/formularios/apogeu/DadosContato';

function Apogeu() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  
  // ✅ Sistema de loading já configurado automaticamente
  const {
    isLoading,
    loadingMessage,
    loadingSubmessage,
    progress,
    withProgressLoading,
    resetLoading
  } = useFormLoading();

  // ✅ Estados do formulário
  const [formData, setFormData] = useState({
    metodoPedido: '',
    titulo: '',
    dataEntrega: '',
    observacoes: '',
    formatoFinal: 'A4',
    corImpressao: 'Preto e Branco',
    impressao: 'Só Frente',
    gramatura: '75g',
    grampos: '0',
    nome: user?.nome || '',
    email: user?.email || '',
    origemDados: '',
    escolasQuantidades: {}
  });

  const [pdfFiles, setPdfFiles] = useState([]);

  // ✅ Função de envio com loading bloqueante
  const handleSubmit = async () => {
    try {
      await withProgressLoading(async (updateProgress, updateStatus) => {
        const result = await submitFormulario(
          formData, 
          pdfFiles, 
          updateProgress, 
          updateStatus
        );
        
        if (result.success) {
          // Sucesso - redirecionar ou mostrar confirmação
          console.log('Formulário Apogeu enviado com sucesso!');
        }
      });
    } catch (error) {
      console.error('Erro ao enviar formulário Apogeu:', error);
    }
  };

  return (
    <>
      {/* ✅ Sistema de loading bloqueante automático */}
      <LoadingOverlay 
        isLoading={isLoading}
        message={loadingMessage}
        submessage={loadingSubmessage}
        progress={progress}
        showProgress={true}
      />
      
      <div className="apogeu-form-container">
        <div className="form-header">
          <h2 className="form-title">
            📋 Formulário Apogeu Educacional
          </h2>
          <div className="step-indicator">
            Etapa {step} de 6
          </div>
        </div>

        {/* Componentes das etapas */}
        {step === 1 && (
          <MetodoPedido 
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(2)}
          />
        )}
        
        {step === 2 && (
          <UploadPDF 
            pdfFiles={pdfFiles}
            setPdfFiles={setPdfFiles}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        
        {/* ... outras etapas ... */}
        
        {step === 6 && (
          <DadosContato 
            formData={formData}
            setFormData={setFormData}
            onBack={() => setStep(5)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </>
  );
}

export default Apogeu;
```

### **2.3 Personalizar Componentes de Etapa (15 minutos)**

Cada componente de etapa herda automaticamente:

1. **✅ Validações robustas**
2. **✅ Estilização consistente** 
3. **✅ Integração com loading**
4. **✅ Tratamento de erros**
5. **✅ Responsividade completa**

**Personalização mínima necessária:**

```jsx
// src/components/formularios/apogeu/MetodoPedido.jsx
import React from 'react';

function MetodoPedido({ formData, setFormData, onNext }) {
  return (
    <div className="apogeu-metodo-pedido">
      <h3>🎯 Como você deseja enviar os dados?</h3>
      
      {/* ✅ Lógica idêntica ao ZeroHum, apenas branding diferente */}
      <div className="metodo-options">
        <div 
          className={`option-card ${formData.metodoPedido === 'manual' ? 'selected' : ''}`}
          onClick={() => setFormData(prev => ({ ...prev, metodoPedido: 'manual' }))}
        >
          <h4>📝 Inserção Manual</h4>
          <p>Digite manualmente cada escola e quantidade</p>
        </div>
        
        <div 
          className={`option-card ${formData.metodoPedido === 'excel' ? 'selected' : ''}`}
          onClick={() => setFormData(prev => ({ ...prev, metodoPedido: 'excel' }))}
        >
          <h4>📊 Planilha Excel</h4>
          <p>Faça upload de uma planilha com os dados</p>
        </div>
      </div>

      <button 
        className="btn-primary"
        onClick={onNext}
        disabled={!formData.metodoPedido}
      >
        Continuar →
      </button>
    </div>
  );
}

export default MetodoPedido;
```
    progress,
    showProgress,
    withProgressLoading
  } = useFormLoading();

  // ✅ Mesmo estado do ZeroHum
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

  // ✅ Etapas personalizadas para Apogeu
  const steps = [
    { number: 1, title: "Método de Pedido", description: "Como enviar os dados" },
    { number: 2, title: "Upload de PDFs", description: "Arquivos do Apogeu" },
    { number: 3, title: "Informações", description: "Detalhes do trabalho" },
    { number: 4, title: "Especificações", description: "Configurações técnicas" },
    { number: 5, title: formData.metodoPedido === 'manual' ? "Unidades" : "Excel", description: "Escolas e quantidades" },
    { number: 6, title: "Finalizar", description: "Confirmar e enviar" }
  ];

  // ✅ Mesma lógica de envio, sistema já preparado
  const handleSubmit = async () => {
    await withProgressLoading(
      async (updateProgress, updateStatus) => {
        const pdfFiles = formData.pdfs.map(pdf => ({
          nome: pdf.name || pdf.file.name,
          tamanho: pdf.size || pdf.file.size,
          tipo: pdf.file.type,
          file: pdf.file
        }));

        const result = await submitFormulario(
          formData, 
          pdfFiles, 
          updateProgress, 
          updateStatus
        );

        if (result.success) {
          setNotification({
            message: 'Formulário do Apogeu enviado com sucesso!',
            type: 'success'
          });
          // Resetar formulário ou redirecionar
        } else {
          setNotification({
            message: result.message || 'Erro ao enviar formulário',
            type: 'error'
          });
        }
      },
      'Processando formulário do Apogeu...',
      'Enviando dados para Casa da Gráfica'
    );
  };

  return (
    <>
      {/* ✅ Sistema de loading bloqueante já funciona */}
      {isLoading && (
        <LoadingOverlay 
          isLoading={isLoading}
          message={loadingMessage}
          submessage={loadingSubmessage}
          showProgress={showProgress}
          progress={progress}
        />
      )}
      
      {/* ✅ Design personalizado para Apogeu */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header personalizado */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600 mb-2">
              📚 Formulário Apogeu Educacional
            </h1>
            <p className="text-gray-600 text-lg">
              Sistema de pedidos gráficos - Apogeu
            </p>
          </div>

          {/* ✅ Barra de progresso reutilizável */}
          <ProgressBar 
            steps={steps} 
            currentStep={step} 
            className="mb-8"
          />

          {/* ✅ Renderização de etapas (mesmo padrão) */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {renderStep()}
          </div>

        </div>
      </div>
    </>
  );
}

export default Apogeu;
```

### **2.3 Personalizar Componentes Filhos (15 minutos)**

Atualizar cada componente em `src/components/formularios/apogeu/` com cores e textos da escola:

```jsx
// Exemplo: src/components/formularios/apogeu/MetodoPedido.jsx
function MetodoPedido({ formData, updateFormData, onNext }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-600 mb-2">
          Como você deseja enviar os dados do Apogeu?
        </h2>
        <p className="text-gray-600">
          Escolha o método de envio dos dados das unidades Apogeu
        </p>
      </div>

      {/* ✅ Resto do código igual, só muda cores e textos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => handleMetodoChange('manual')}
          className={`p-6 rounded-xl border-2 transition-all ${
            formData.metodoPedido === 'manual' 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          {/* Conteúdo igual ao ZeroHum */}
        </button>
      </div>
    </div>
  );
}
```

### **2.4 Adicionar Rota (1 minuto)**

```jsx
// src/routes/AppRoutes.jsx
import { lazy } from 'react';

const ZeroHum = lazy(() => import('../pages/formularios/ZeroHum'));
const Apogeu = lazy(() => import('../pages/formularios/Apogeu')); // ✅ Nova escola

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas existentes */}
      <Route 
        path="/formularios/zerohum" 
        element={
          <ProtectedRoute requiredPermissions={['zerohum', 'all']}>
            <Suspense fallback={<div>Carregando...</div>}>
              <ZeroHum />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      {/* ✅ Nova rota para Apogeu */}
      <Route 
        path="/formularios/apogeu" 
        element={
          <ProtectedRoute requiredPermissions={['apogeu', 'all']}>
            <Suspense fallback={<div>Carregando...</div>}>
              <Apogeu />
            </Suspense>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

### **2.5 Atualizar Home para Mostrar Nova Escola (2 minutos)**

```jsx
// src/pages/Home.jsx
function Home() {
  const { hasPermission } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Formulários por escola */}
      {hasPermission('zerohum') && (
        <DashboardCard 
          title="Formulário ZeroHum"
          description="Acessar formulário da ZeroHum"
          icon="🎓"
          path="/formularios/zerohum"
          bgColor="from-green-50 to-blue-50"
          iconColor="text-green-600"
        />
      )}

      {/* ✅ Nova escola Apogeu */}
      {hasPermission('apogeu') && (
        <DashboardCard 
          title="Formulário Apogeu"
          description="Acessar formulário do Apogeu Educacional"
          icon="📚"
          path="/formularios/apogeu"
          bgColor="from-purple-50 to-indigo-50"
          iconColor="text-purple-600"
        />
      )}

      {/* Admin continua vendo todos */}
      {hasPermission('all') && (
        <>
          <DashboardCard 
            title="Todos os Formulários" 
            path="/formularios" 
            icon="📊"
          />
          <DashboardCard 
            title="Gestão de Usuários" 
            path="/usuarios"
            icon="👥" 
          />
        </>
      )}
    </div>
  );
}
```

---

## ✅ Etapa 3: Verificação e Testes

### **3.1 Checklist de Verificação**
- [ ] Usuário "apogeu" criado no banco
- [ ] Mapeamento adicionado em `USER_FORM_MAPPING`
- [ ] Componente `Apogeu.jsx` criado e personalizado
- [ ] Componentes filhos personalizados
- [ ] Rota `/formularios/apogeu` adicionada
- [ ] Card na Home adicionado
- [ ] Cores e textos personalizados

### **3.2 Teste de Funcionalidade**
1. **Login:** `username: apogeu` / `senha: apogeu123`
2. **Redirecionamento automático** para `/formularios/apogeu`
3. **Formulário funcional** com todas as 6 etapas
4. **Loading bloqueante** durante envio
5. **Upload para Google Drive** funcionando
6. **Dados salvos** no SQLite

### **3.3 Teste de Segurança**
```bash
# Usuário "apogeu" NÃO deve acessar outros formulários
GET /formularios/zerohum   # ❌ 403 Forbidden
GET /formularios/apogeu    # ✅ 200 OK

# Admin continua acessando todos
GET /formularios/zerohum   # ✅ 200 OK (se admin)
GET /formularios/apogeu    # ✅ 200 OK (se admin)
```

---

## 🚀 Vantagens da Arquitetura Escalável

### **✅ Isolamento Completo**
```javascript
// Cada escola tem:
- Usuário próprio com permissões específicas
- Formulário dedicado com design personalizado  
- Dados isolados no banco de dados
- Pasta própria no Google Drive
- Autenticação independente
```

### **✅ Reutilização de Código**
```javascript
// Componentes compartilhados:
- LoadingOverlay (sistema de loading)
- ProgressBar (barra de progresso)
- useFormLoading (hook de loading)
- formularioService (API calls)
- Notification (notificações)
```

### **✅ Manutenção Simplificada**
```javascript
// Mudanças em uma escola NÃO afetam outras:
- Cores e design independentes
- Lógica de negócio isolada
- Atualizações sem risco
- Deploy independente por escola
```

### **✅ Performance Otimizada**
```javascript
// Cada escola carrega apenas seus recursos:
- Lazy loading por formulário
- Chunks separados no build
- Cache independente
- Menos JavaScript carregado
```

---

## 📈 Escalabilidade Ilimitada

### **Próximas Escolas - Template Pronto**

Para adicionar **Elite**, **Coleguium**, **Pensi**, etc:

```bash
# 1. Backend (30 segundos)
Usuario.create({
  username: "elite",
  roles: ["elite"],
  // ... outros dados
});

# 2. Frontend (20 minutos) 
cp -r zerohum/ elite/
# Personalizar cores e textos

# 3. Rota (30 segundos)
<Route path="/formularios/elite" element={<Elite />} />

# 4. Home (30 segundos)
{hasPermission('elite') && <DashboardCard path="/formularios/elite" />}
```

### **Estatísticas de Escalabilidade**

| Escolas | Tempo Total | Complexidade |
|---------|-------------|--------------|
| 1-5     | ~35min cada | Baixa        |
| 6-10    | ~25min cada | Baixa        |
| 11-20   | ~20min cada | Média        |
| 21+     | ~15min cada | Baixa*       |

*Com automação de scripts

---

## 🔧 Automação Futura (Opcional)

### **Script de Criação Automática**
```javascript
// scripts/criarNovaEscola.js
const criarNovaEscola = async (nomeEscola, dados) => {
  // 1. Criar usuário no banco
  await criarUsuario(nomeEscola, dados);
  
  // 2. Gerar componentes React
  await gerarComponentes(nomeEscola, dados.cores);
  
  // 3. Atualizar rotas automaticamente
  await atualizarRotas(nomeEscola);
  
  // 4. Atualizar mapeamentos
  await atualizarMapeamentos(nomeEscola);
  
  console.log(`✅ Escola ${nomeEscola} criada com sucesso!`);
};

// Uso:
criarNovaEscola('apogeu', {
  nome: 'Apogeu Educacional',
  email: 'contato@apogeu.edu.br',
  cores: {
    primary: 'purple',
    secondary: 'indigo'
  }
});
```

---

## 🎯 Conclusão

O sistema Casa da Gráfica é **extremamente escalável** e permite adicionar **dezenas de escolas** mantendo:

- ✅ **Segurança total** entre escolas
- ✅ **Performance otimizada** 
- ✅ **Manutenção simples**
- ✅ **Tempo mínimo** de implementação
- ✅ **Qualidade profissional** 

**🚀 Total: ~35 minutos para uma escola completamente funcional!**

A arquitetura modular permite que cada escola tenha sua **identidade visual**, **lógica específica** e **dados isolados**, enquanto compartilha toda a **infraestrutura robusta** já desenvolvida.

**Resultado:** Sistema escalável para crescimento ilimitado! 🎉
