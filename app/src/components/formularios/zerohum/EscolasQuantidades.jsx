import { useState, useRef } from 'react';

function EscolasQuantidades({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  // Lista de escolas ZeroHum
  const escolas = [
    'ARARUAMA', 'CABO_FRIO', 'ITABORAI', 'ITAIPUACU', 'MARICA_I',
    'NOVA_FRIBURGO', 'QUEIMADOS', 'SEROPEDICA', 'ALCANTARA', 'BANGU',
    'BARRA_DA_TIJUCA', 'BELFORD_ROXO', 'DUQUE_DE_CAXIAS', 'ICARA',
    'ILHA_DO_GOVERNADOR', 'ITAIPAVA', 'MADUREIRA', 'MEIER', 'NILOPOLIS',
    'NITEROI', 'NOVA_IGUACU', 'OLARIA', 'PRATA', 'SAO_GONCALO',
    'SAO_JOAO_DE_MERITI', 'VILA_ISABEL', 'VILAR_DOS_TELES'
  ];
  
  const handleQuantidadeChange = (escola, quantidade) => {
    updateFormData('escolasQuantidades', {
      ...formData.escolasQuantidades,
      [escola]: quantidade === '' ? '' : parseInt(quantidade, 10)
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Por favor, selecione apenas arquivos Excel (.xls ou .xlsx)');
      return;
    }
    
    updateFormData('arquivoExcel', file);
    setError('');
  };
  
  const handleContinue = () => {
    if (formData.metodoPedido === 'manual') {
      // Verificar se pelo menos uma escola tem quantidade
      const temQuantidade = Object.values(formData.escolasQuantidades).some(qty => qty && qty > 0);
      
      if (!temQuantidade) {
        setError('Por favor, informe a quantidade para pelo menos uma escola');
        return;
      }
    } else {
      // Método Excel
      if (!formData.arquivoExcel) {
        setError('Por favor, faça upload da planilha preenchida');
        return;
      }
    }
    
    setError('');
    onNext();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">
        {formData.metodoPedido === 'manual' ? 'Escolas e Quantidades' : 'Upload de Planilha Excel'}
      </h2>
      
      {formData.metodoPedido === 'manual' ? (
        <>
          <p className="text-gray-400">
            Informe a quantidade de cópias para cada unidade escolar
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {escolas.map((escola) => (
              <div key={escola} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <label className="text-gray-300" htmlFor={`escola-${escola}`}>
                  {escola.replace(/_/g, ' ')}
                </label>
                <input
                  type="number"
                  id={`escola-${escola}`}
                  min="0"
                  value={formData.escolasQuantidades[escola] || ''}
                  onChange={(e) => handleQuantidadeChange(escola, e.target.value)}
                  className="w-24 px-3 py-1 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-400">
            Baixe a planilha, preencha e faça o upload do arquivo
          </p>
          
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800">
            <a
              href="https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fcdgsystem.onrender.com%2Fstatic%2FEx%2FZeroHumExPadrao.xlsx&wdOrigin=BROWSELINK"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 mb-6 bg-[var(--color-primary)] text-black font-medium rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Baixar Planilha Padrão
            </a>
            
            <div 
              onClick={() => fileInputRef.current.click()}
              className="w-full p-6 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500"
            >
              <svg className="w-10 h-10 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
              <p className="text-center mb-1">
                {formData.arquivoExcel ? formData.arquivoExcel.name : 'Clique para fazer upload da planilha preenchida'}
              </p>
              <p className="text-sm text-gray-500">Apenas arquivos Excel (.xls ou .xlsx)</p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                onChange={handleFileChange}
              />
            </div>
            
            {formData.arquivoExcel && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg w-full flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 2.05v3.02a7 7 0 10.001 13.95v3.02C6.075 21.775 2 17.535 2 12.05c0-5.555 4.275-9.828 9-10zM13 2.05c4.725.172 9 4.445 9 10 0 5.485-4.075 9.725-9 10v-3.02a7 7 0 100-13.95V2.05z"/>
                  </svg>
                  <span className="font-medium">Arquivo carregado</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFormData('arquivoExcel', null);
                  }}
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Mensagem de erro */}
      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
      
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

export default EscolasQuantidades;
