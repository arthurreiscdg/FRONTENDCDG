import { useState, use, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormCard from '../components/FormCard';
import { useAuth } from '../contexts/AuthContext';

// Dados dos formulários
const formularioData = [
  {
    id: 'coleguium',
    title: 'Coleguium',
    description: 'Formulário específico para o sistema Coleguium, com campos personalizados para esta instituição.',
    iconType: 'user',
    path: '/formularios/coleguium'
  },
  {
    id: 'elite',
    title: 'Elite',
    description: 'Formulário Elite com campos avançados e opções adicionais para processamento prioritário.',
    iconType: 'chart',
    path: '/formularios/elite'
  },
  {
    id: 'zerohum',
    title: 'ZeroHum',
    description: 'Formulário ZeroHum otimizado para velocidade e eficiência no processamento de dados.',
    iconType: 'settings',
    path: '/formularios/zerohum'
  },
  {
    id: 'pensi',
    title: 'Pensi',
    description: 'Formulário Pensi com recursos especiais para análise e visualização de dados.',
    iconType: 'document',
    path: '/formularios/pensi'
  },
  {
    id: 'apogeu',
    title: 'Apogeu',
    description: 'Formulário Apogeu com interface moderna e funcionalidades integradas.',
    iconType: 'home',
    path: '/formularios/apogeu'
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
  const navigate = useNavigate();
  const { getDirectFormPath } = useAuth();
  
  const [selectedForm, setSelectedForm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [availableForms, setAvailableForms] = useState(formularioData);

  // Verificar se o usuário deve ser redirecionado para um formulário específico
  useEffect(() => {
    const directFormPath = getDirectFormPath();
    
    if (directFormPath) {
      // Redirecionar para o formulário específico
      navigate(directFormPath);
    } else if (currentUser?.role === 'admin' || currentUser?.permissions?.includes('all')) {
      // Administradores veem todos os formulários
      setAvailableForms(formularioData);
    } else {
      // Verificar se o usuário tem acesso a algum formulário específico
      // Caso não tenha um acesso direto, mas tenha permissão para ver formulários
      setAvailableForms(formularioData);
    }
  }, [navigate, getDirectFormPath, currentUser]);

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
    
    // Navegar para a página do formulário selecionado
    navigate(form.path);
  };

  return (
    <div>
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all transform duration-300 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
        >
          {notification.message}
        </div>      )}
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-primary mb-2">Formulários</h1>
        <p className="text-gray-400">
          Selecione o tipo de formulário que deseja preencher
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {availableForms.map((form) => (
          <FormCard
            key={form.id}
            title={form.title}
            description={form.description}
            iconType={form.iconType}
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
