import { useState } from 'react';

function MetodoPedido({ formData, updateFormData, onNext }) {
  const [error, setError] = useState('');
  
  const handleMetodoChange = (metodo) => {
    updateFormData('metodoPedido', metodo);
  };
  
  const handleContinue = () => {
    if (!formData.metodoPedido) {
      setError('Por favor, selecione um método de pedido');
      return;
    }
    
    setError('');
    onNext();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Método de Pedido</h2>
      <p className="text-gray-400">
        Escolha como você deseja preencher as informações das escolas e quantidades
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Opção Manual */}
        <div 
          className={`
            p-5 border rounded-lg cursor-pointer transition-all
            ${formData.metodoPedido === 'manual' 
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' 
              : 'border-app-border bg-gray-800 hover:bg-gray-800/70'}
          `}
          onClick={() => handleMetodoChange('manual')}
        >
          <div className="flex items-start">
            <div 
              className={`
                w-6 h-6 rounded-full border flex items-center justify-center mr-3 mt-1
                ${formData.metodoPedido === 'manual' 
                  ? 'border-[var(--color-primary)]' 
                  : 'border-gray-500'}
              `}
            >
              {formData.metodoPedido === 'manual' && (
                <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-lg">Preenchimento Manual</h3>
              <p className="text-gray-400 mt-1">
                Digite manualmente as quantidades para cada unidade escolar
              </p>
            </div>
          </div>
        </div>
        
        {/* Opção Excel */}
        <div 
          className={`
            p-5 border rounded-lg cursor-pointer transition-all
            ${formData.metodoPedido === 'excel' 
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' 
              : 'border-app-border bg-gray-800 hover:bg-gray-800/70'}
          `}
          onClick={() => handleMetodoChange('excel')}
        >
          <div className="flex items-start">
            <div 
              className={`
                w-6 h-6 rounded-full border flex items-center justify-center mr-3 mt-1
                ${formData.metodoPedido === 'excel' 
                  ? 'border-[var(--color-primary)]' 
                  : 'border-gray-500'}
              `}
            >
              {formData.metodoPedido === 'excel' && (
                <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-lg">Planilha Excel</h3>
              <p className="text-gray-400 mt-1">
                Baixe, preencha e faça o upload da planilha de Excel com todas as quantidades
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
      
      <div className="flex justify-end mt-6">
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

export default MetodoPedido;
