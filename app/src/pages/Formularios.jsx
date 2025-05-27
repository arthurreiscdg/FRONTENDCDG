import { useState, use } from 'react';
import FormCard from '../components/FormCard';

// Dados dos formulários
const formularioData = [
  {
    id: 'coleguium',
    title: 'Coleguium',
    description: 'Formulário específico para o sistema Coleguium, com campos personalizados para esta instituição.',
    icon: '🏫',
    path: '/formularios/coleguium'
  },
  {
    id: 'elite',
    title: 'Elite',
    description: 'Formulário Elite com campos avançados e opções adicionais para processamento prioritário.',
    icon: '⭐',
    path: '/formularios/elite'
  },
  {
    id: 'zerohum',
    title: 'ZeroHum',
    description: 'Formulário ZeroHum otimizado para velocidade e eficiência no processamento de dados.',
    icon: '🚀',
    path: '/formularios/zerohum'
  },
  {
    id: 'pensi',
    title: 'Pensi',
    description: 'Formulário Pensi com recursos especiais para análise e visualização de dados.',
    icon: '📊',
    path: '/formularios/pensi'
  }
];

// Função para obter os dados do usuário do localStorage
function getUserFromStorage() {
  try {
    const userInfo = localStorage.getItem('currentUser');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (e) {
    console.error('Erro ao obter dados do usuário:', e);
    return null;
  }
}

// Promessa para usar com o hook use
const userPromise = Promise.resolve(getUserFromStorage());

function Formularios() {
  // Usando o novo hook use para obter o usuário atual
  const currentUser = use(userPromise);
  
  const [selectedForm, setSelectedForm] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleSelectForm = (form) => {
    setSelectedForm(form);
    setNotification({
      message: `${form.title} selecionado com sucesso!`,
      type: 'success'
    });
    
    // Remove a notificação após 3 segundos
    setTimeout(() => {
      setNotification(null);
    }, 3000);
    
    // Aqui você pode adicionar lógica adicional, como navegação para o formulário específico
    // navigate(form.path);
  };

  return (
    <div>
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all transform duration-300 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
        >
          {notification.message}
        </div>
      )}
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-primary mb-2">Formulários</h1>
        <p className="text-gray-400">
          Selecione o tipo de formulário que deseja preencher
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {formularioData.map((form) => (
          <FormCard
            key={form.id}
            title={form.title}
            description={form.description}
            icon={form.icon}
            path={form.path}
            onSelect={handleSelectForm}
          />
        ))}
      </div>
        {selectedForm && (
        <div className="mt-8 p-6 bg-app-card rounded-xl shadow-lg border border-app-border">
          <h2 className="text-2xl font-bold text-app-primary mb-4">
            Formulário {selectedForm.title} selecionado
          </h2>
          <p className="text-gray-400 mb-4">
            Esta funcionalidade está em desenvolvimento.
          </p>
          {currentUser && (
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400">Selecionado por:</p>
              <p className="font-medium text-white">{currentUser.username}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Formularios;
