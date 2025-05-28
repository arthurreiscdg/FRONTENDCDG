import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { submitFormulario } from '../../services/formularioService';
import useFormLoading from '../../hooks/useFormLoading';
import LoadingOverlay from '../../components/common/LoadingOverlay';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
    // Hook personalizado para loading
  const {
    isLoading,
    loadingMessage,
    loadingSubmessage,
    progress,
    showProgress,
    updateProgress,
    updateMessage,
    withProgressLoading
  } = useFormLoading();
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
      // Debug: verificar estado dos PDFs
      console.log('Estado dos PDFs no formulário:', formData.pdfs);
      console.log('Quantidade de PDFs:', formData.pdfs?.length || 0);

      // Preparar dados para envio
      const formDataToSubmit = {
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
        origemDados: formData.metodoPedido,
        escolasQuantidades: formData.escolasQuantidades,
        pdfs: formData.pdfs // Incluir os PDFs na validação
      };

      // Preparar arquivos PDF - usar a estrutura correta
      const pdfFiles = formData.pdfs.map(pdf => ({
        nome: pdf.name || pdf.file.name,
        tamanho: pdf.size || pdf.file.size,
        tipo: pdf.file.type,
        file: pdf.file
      }));

      console.log('Dados preparados para envio:', formDataToSubmit);
      console.log('Arquivos PDF preparados:', pdfFiles);

      // Usar o hook para loading com progresso
      const result = await withProgressLoading(
        async (onProgress) => {
          return await submitFormulario(
            formDataToSubmit, 
            pdfFiles,
            onProgress,
            updateMessage
          );
        },
        'Enviando formulário ZeroHum...',
        'Processando dados e arquivos PDF - não feche esta página'
      );

      if (result.success) {
        setSubmissionResult(result);
        setShowSuccessModal(true);
        setNotification({
          message: 'Formulário enviado com sucesso!',
          type: 'success'
        });
      } else {
        setNotification({
          message: result.message || 'Erro ao enviar formulário',
          type: 'error'
        });
      }

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setNotification({
        message: `Erro ao enviar formulário: ${error.message}`,
        type: 'error'
      });
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
        );      case 6:
        return (
          <DadosContato 
            formData={formData} 
            updateFormData={updateFormData} 
            onBack={handleBack}
            onSubmit={handleSubmit}
            loading={isLoading}
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

      {/* Loading Overlay - Sistema Bloqueante Completo */}
      <LoadingOverlay 
        isLoading={isLoading}
        message={loadingMessage}
        submessage={loadingSubmessage}
        showProgress={showProgress}
        progress={progress}
      />{/* Modal de sucesso */}
      {showSuccessModal && submissionResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-app-card rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-green-500 mb-2">Sucesso!</h2>
              <p className="text-gray-300 mb-6">
                Seu formulário foi enviado com sucesso. Você receberá um e-mail de confirmação em breve.
              </p>
              
              {submissionResult.data && (
                <div className="bg-gray-900 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-400 mb-2">ID do pedido:</p>
                  <p className="text-green-400 font-mono">{submissionResult.data.id || 'Processando...'}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    setShowSuccessModal(false);
                    // Reset do formulário
                    setFormData({
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
                    setStep(1);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Novo Formulário
                </button>
                
                <button 
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/formularios');
                  }}
                  className="px-4 py-2 bg-[var(--color-primary)] text-black font-medium rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
                >
                  Ver Formulários
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZeroHum;
