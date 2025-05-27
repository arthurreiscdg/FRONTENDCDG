import { useState } from 'react';
import InfoOrigem from './InfoOrigem';

function DadosContato({ formData, updateFormData, onBack, onSubmit, loading }) {
  const [errors, setErrors] = useState({
    nome: '',
    email: ''
  });
  const [concordaTermos, setConcordaTermos] = useState(false);
  const [termoError, setTermoError] = useState('');
  
  const handleInputChange = (field, value) => {
    updateFormData(field, value);
    
    // Limpar erro quando o campo for preenchido
    if (value.trim() !== '') {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {
      nome: '',
      email: ''
    };
    let isValid = true;
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Digite um email válido';
      isValid = false;
    }
    
    if (!concordaTermos) {
      setTermoError('Você precisa concordar com os termos para continuar');
      isValid = false;
    } else {
      setTermoError('');
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleConcluir = () => {
    if (validateForm()) {
      onSubmit();
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Dados de Contato</h2>
      <p className="text-gray-400">
        Informe seus dados de contato para finalizar o pedido
      </p>
      
      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-1">
            Nome *
          </label>
          <input
            type="text"
            id="nome"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            className={`w-full px-4 py-2 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.nome ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Seu nome completo"
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-500">{errors.nome}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-2 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.email ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="seu.email@exemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        {/* Termos */}
        <div className="mt-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={concordaTermos}
              onChange={(e) => {
                setConcordaTermos(e.target.checked);
                if (e.target.checked) setTermoError('');
              }}
              className="mt-1 w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span className="ml-2 text-gray-400 text-sm">
              Ao enviar este formulário, você concorda em ser contatado sobre seu pedido de produção de documentos.
              Seus dados serão usados apenas para processamento do pedido e comunicações relacionadas a ele.
            </span>
          </label>
          {termoError && (
            <p className="mt-1 text-sm text-red-500">{termoError}</p>
          )}
        </div>
      </div>
        {/* Resumo do pedido */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="font-medium text-white mb-2">Resumo do Pedido</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Método de Pedido:</span>
            <span className="text-white capitalize">{formData.metodoPedido}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">PDFs:</span>
            <span className="text-white">{formData.pdfs.length} arquivo(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Material:</span>
            <span className="text-white">{formData.titulo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Data de Entrega:</span>
            <span className="text-white">{new Date(formData.dataEntrega).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Escolas:</span>
            <span className="text-white">{Object.keys(formData.escolasQuantidades).length} unidade(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total de cópias:</span>
            <span className="text-white">{Object.values(formData.escolasQuantidades).reduce((a, b) => a + b, 0)}</span>
          </div>
          
          {/* Componente para mostrar a origem dos dados */}
          <InfoOrigem metodoPedido={formData.metodoPedido} arquivoExcel={formData.arquivoExcel} />
        </div>
      </div>
      
      {/* Botões de navegação */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Voltar
        </button>        <button
          onClick={handleConcluir}
          disabled={loading}
          className={`px-6 py-2 bg-[var(--color-primary)] text-black font-medium rounded-lg 
            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--color-primary)]/90'} 
            transition-colors`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-t-2 border-b-2 border-black rounded-full animate-spin mr-2"></div>
              <span>Processando...</span>
            </div>
          ) : 'Concluir Pedido'}
        </button>
      </div>
    </div>
  );
}

export default DadosContato;
