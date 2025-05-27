import { useState } from 'react';

function InformacoesTrabalhho({ formData, updateFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({
    titulo: '',
    dataEntrega: ''
  });
  
  const handleInputChange = (field, value) => {
    updateFormData(field, value);
    
    // Limpar erro quando o campo for preenchido
    if (value.trim() !== '') {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {
      titulo: '',
      dataEntrega: ''
    };
    let isValid = true;
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'O título do material é obrigatório';
      isValid = false;
    }
    
    if (!formData.dataEntrega) {
      newErrors.dataEntrega = 'A data de entrega é obrigatória';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleContinue = () => {
    if (validateForm()) {
      onNext();
    }
  };
  
  // Calcular a data mínima (hoje)
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Informações do Trabalho</h2>
      <p className="text-gray-400">
        Informe os detalhes básicos sobre o material a ser produzido
      </p>
      
      <div className="space-y-4">
        {/* Título do Material */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-300 mb-1">
            Título do Material *
          </label>
          <input
            type="text"
            id="titulo"
            value={formData.titulo}
            onChange={(e) => handleInputChange('titulo', e.target.value)}
            className={`w-full px-4 py-2 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.titulo ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Ex: Apostila de Matemática - 3° Ano"
          />
          {errors.titulo && (
            <p className="mt-1 text-sm text-red-500">{errors.titulo}</p>
          )}
        </div>
        
        {/* Data de Entrega */}
        <div>
          <label htmlFor="dataEntrega" className="block text-sm font-medium text-gray-300 mb-1">
            Data de Entrega na Escola *
          </label>
          <input
            type="date"
            id="dataEntrega"
            value={formData.dataEntrega}
            onChange={(e) => handleInputChange('dataEntrega', e.target.value)}
            min={today}
            className={`w-full px-4 py-2 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.dataEntrega ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          {errors.dataEntrega && (
            <p className="mt-1 text-sm text-red-500">{errors.dataEntrega}</p>
          )}
        </div>
        
        {/* Observações */}
        <div>
          <label htmlFor="observacoes" className="block text-sm font-medium text-gray-300 mb-1">
            Observações (opcional)
          </label>
          <textarea
            id="observacoes"
            value={formData.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="Informações adicionais sobre o pedido..."
          />
        </div>
      </div>
      
      {/* Botões de navegação */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-[var(--color-primary)] text-black font-medium rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default InformacoesTrabalhho;
