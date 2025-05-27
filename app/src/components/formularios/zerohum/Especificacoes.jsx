import { useState } from 'react';

function Especificacoes({ formData, updateFormData, onNext, onBack }) {
  const formatosDisponiveis = ['A4', 'A3', 'A2', 'A1'];
  const coresDisponiveis = ['Preto e Branco', 'Colorido'];
  const impressaoOpcoes = ['Só Frente', 'Frente e Verso'];
  const gramaturaOpcoes = ['75g', '90g', '120g', '150g'];
  const gramposOpcoes = ['0', '1', '2'];
  
  const handleInputChange = (field, value) => {
    updateFormData(field, value);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Especificações</h2>
      <p className="text-gray-400">
        Defina as características técnicas para a impressão do material
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Formato Final */}
        <div>
          <label htmlFor="formatoFinal" className="block text-sm font-medium text-gray-300 mb-1">
            Formato Final
          </label>
          <select
            id="formatoFinal"
            value={formData.formatoFinal}
            onChange={(e) => handleInputChange('formatoFinal', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {formatosDisponiveis.map((formato) => (
              <option key={formato} value={formato}>
                {formato}
              </option>
            ))}
          </select>
        </div>
        
        {/* Cor da Impressão */}
        <div>
          <label htmlFor="corImpressao" className="block text-sm font-medium text-gray-300 mb-1">
            Cor da Impressão
          </label>
          <select
            id="corImpressao"
            value={formData.corImpressao}
            onChange={(e) => handleInputChange('corImpressao', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {coresDisponiveis.map((cor) => (
              <option key={cor} value={cor}>
                {cor}
              </option>
            ))}
          </select>
        </div>
        
        {/* Impressão */}
        <div>
          <label htmlFor="impressao" className="block text-sm font-medium text-gray-300 mb-1">
            Impressão
          </label>
          <select
            id="impressao"
            value={formData.impressao}
            onChange={(e) => handleInputChange('impressao', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {impressaoOpcoes.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </div>
        
        {/* Gramatura */}
        <div>
          <label htmlFor="gramatura" className="block text-sm font-medium text-gray-300 mb-1">
            Gramatura
          </label>
          <select
            id="gramatura"
            value={formData.gramatura}
            onChange={(e) => handleInputChange('gramatura', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {gramaturaOpcoes.map((gramatura) => (
              <option key={gramatura} value={gramatura}>
                {gramatura}
              </option>
            ))}
          </select>
        </div>
        
        {/* Grampos */}
        <div className="md:col-span-2">
          <label htmlFor="grampos" className="block text-sm font-medium text-gray-300 mb-1">
            Grampos
          </label>
          <div className="flex space-x-4">
            {gramposOpcoes.map((grampo) => (
              <label key={grampo} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="grampos"
                  value={grampo}
                  checked={formData.grampos === grampo}
                  onChange={() => handleInputChange('grampos', grampo)}
                  className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-gray-300">{grampo === '0' ? 'Nenhum' : grampo}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Resumo das especificações selecionadas */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="font-medium text-white mb-2">Resumo das Especificações</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Formato:</span>
            <span className="text-white">{formData.formatoFinal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Impressão:</span>
            <span className="text-white">{formData.corImpressao}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Páginas:</span>
            <span className="text-white">{formData.impressao}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Gramatura:</span>
            <span className="text-white">{formData.gramatura}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Grampos:</span>
            <span className="text-white">{formData.grampos === '0' ? 'Nenhum' : formData.grampos}</span>
          </div>
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
          onClick={onNext}
          className="px-6 py-2 bg-[var(--color-primary)] text-black font-medium rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default Especificacoes;
