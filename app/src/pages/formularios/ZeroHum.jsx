import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProgressBar from '../../components/formularios/ProgressBar';
import MetodoPedido from '../../components/formularios/zerohum/MetodoPedido';
import UploadPDF from '../../components/formularios/zerohum/UploadPDF';
import InformacoesTrabalhho from '../../components/formularios/zerohum/InformacoesTrabalhho';
import Especificacoes from '../../components/formularios/zerohum/Especificacoes';
import EscolasQuantidades from '../../components/formularios/zerohum/EscolasQuantidades';
import DadosContato from '../../components/formularios/zerohum/DadosContato';
import Notification from '../../components/Notification';

function ZeroHum() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [formData, setFormData] = useState({
    metodoPedido: '',  // 'manual' ou 'excel'
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

  const steps = [
    { number: 1, title: "Método de pedido" },
    { number: 2, title: "Upload de PDF" },
    { number: 3, title: "Informações do Trabalho" },
    { number: 4, title: "Especificações" },
    { number: 5, title: formData.metodoPedido === 'manual' ? "Escolas" : "Excel" },
    { number: 6, title: "Dados de Contato" }
  ];

  const handleNext = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setStep(prevStep => prevStep - 1);
  };

  const updateFormData = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Preparar os dados para visualização
      const formDataJson = {
        metodoPedido: formData.metodoPedido,
        titulo: formData.titulo,
        dataEntrega: formData.dataEntrega,
        observacoes: formData.observacoes,
        formatoFinal: formData.formatoFinal,
        corImpressao: formData.corImpressao,
        impressao: formData.impressao,
        gramatura: formData.gramatura,
        grampos: formData.grampos,
        nome: formData.nome,
        email: formData.email,
        pdfs: formData.pdfs.map(pdf => ({
          nome: pdf.file.name,
          tamanho: `${(pdf.file.size / 1024 / 1024).toFixed(2)} MB`,
          tipo: pdf.file.type
        }))
      };

      // Adicionar dados específicos baseado no método de pedido
      if (formData.metodoPedido === 'manual') {
        formDataJson.escolasQuantidades = Object.entries(formData.escolasQuantidades)
          .filter(([_, quantidade]) => quantidade)
          .reduce((acc, [escola, quantidade]) => {
            acc[escola] = quantidade;
            return acc;
          }, {});
      } else {
        formDataJson.arquivoExcel = formData.arquivoExcel ? {
          nome: formData.arquivoExcel.name,
          tamanho: `${(formData.arquivoExcel.size / 1024 / 1024).toFixed(2)} MB`,
          tipo: formData.arquivoExcel.type
        } : null;
      }

      // Mostrar no console para debug
      console.log("Dados do formulário (JSON):", formDataJson);
      
      // Simulação de envio FormData (para visualização)
      const formDataToSend = new FormData();
      
      // Adicionar dados básicos
      Object.entries(formDataJson).forEach(([key, value]) => {
        // Não adicionar objetos complexos diretamente ao FormData
        if (typeof value !== 'object') {
          formDataToSend.append(key, value);
        }
      });
      
      // Adicionar arquivos PDF
      formData.pdfs.forEach((pdf, index) => {
        formDataToSend.append(`pdf_${index}`, pdf.file);
      });
      
      // Adicionar dados de escolas/quantidades ou Excel
      if (formData.metodoPedido === 'manual') {
        formDataToSend.append('escolasQuantidades', JSON.stringify(formDataJson.escolasQuantidades));
      } else if (formData.arquivoExcel) {
        formDataToSend.append('arquivoExcel', formData.arquivoExcel);
      }
      
      console.log("FormData (chaves):", [...formDataToSend.keys()]);

      // Armazenar dados para mostrar no modal
      setApiData(formDataJson);
      setShowDataModal(true);

      // Mostrar notificação
      setNotification({
        message: 'Visualizando dados que seriam enviados à API',
        type: 'info'
      });
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      setNotification({
        message: `Erro ao processar dados: ${error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <MetodoPedido 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
          />
        );
      case 2:
        return (
          <UploadPDF 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <InformacoesTrabalhho 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Especificacoes 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <EscolasQuantidades 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <DadosContato 
            formData={formData} 
            updateFormData={updateFormData} 
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };  return (
    <div className="bg-app-dark text-white">
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="bg-app-card p-6 rounded-xl shadow-lg border border-app-border mb-6">
        <h1 className="text-2xl font-bold text-app-primary mb-2">Formulário ZeroHum de Pedido de Produção</h1>
        <p className="text-gray-400 mb-6">
          Preencha os detalhes abaixo para solicitar a produção do seu material
        </p>
        
        <ProgressBar currentStep={step} steps={steps} />
      </div>
      
      <div className="bg-app-card p-6 rounded-xl shadow-lg border border-app-border">
        {renderStep()}
      </div>

      {/* Modal para visualização dos dados da API */}
      {showDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-app-card rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold text-app-primary mb-4">Dados que seriam enviados para a API</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-white mb-2">Método de envio:</h3>
              <p className="text-gray-300">FormData (multipart/form-data) - necessário para envio de arquivos</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-white mb-2">Estrutura dos dados:</h3>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 max-h-96">
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-2">Observações:</h3>
              <ul className="list-disc text-gray-300 pl-5 space-y-1">
                <li>Os arquivos (PDFs e Excel) são enviados como arquivos binários no FormData</li>
                <li>Os dados JSON são convertidos para string quando enviados via FormData</li>
                <li>No backend, será necessário processar cada tipo de dado adequadamente</li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setShowDataModal(false)}
                className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
              
              <button 
                onClick={() => {
                  setShowDataModal(false);
                  navigate('/formularios');
                }}
                className="px-4 py-2 bg-[var(--color-primary)] text-black font-medium rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
              >
                Voltar para formulários
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZeroHum;
