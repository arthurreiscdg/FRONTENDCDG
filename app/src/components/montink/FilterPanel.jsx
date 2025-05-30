import React, { useState } from 'react';

/**
 * Painel de filtros para pedidos da Montink
 * Implementado como dropdown expansível para melhor UX
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onFilter - Callback para aplicar filtros
 * @param {Array} props.statusOptions - Opções de status disponíveis
 */
function FilterPanel({ onFilter, statusOptions = [] }) {
  const [filters, setFilters] = useState({
    status: '',
    sku: '',
    dataEmissao: '',
    numeroPedido: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Componente de ícone SVG minimalista
  const Icon = ({ type, className = "w-5 h-5" }) => {
    const icons = {
      search: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      )
    };
    
    return icons[type] || icons.search;
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleFilter = () => {
    onFilter(filters);
    // Opcional: fechar o dropdown após filtrar
    // setIsExpanded(false);
  };  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      sku: '',
      dataEmissao: '',
      numeroPedido: ''
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  // Verifica se há filtros ativos
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  return (
    <div className={`bg-app-card border border-app-border rounded-lg overflow-hidden transition-shadow duration-300 ${isExpanded ? 'shadow-lg shadow-black/20' : ''}`}>      {/* Barra do dropdown - sempre visível */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon type="search" className="w-6 h-6 text-app-primary group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-semibold text-app-primary">
              Filtrar Pedidos
            </h3>
          </div>
          
          {/* Indicador de filtros ativos */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-app-primary text-black px-2 py-1 rounded-full font-medium">
                Filtros ativos
              </span>
              <div className="w-2 h-2 bg-app-primary rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Contador de filtros ativos */}
          {hasActiveFilters && (
            <span className="text-sm text-gray-400 font-medium">
              {Object.values(filters).filter(value => value !== '').length} aplicado(s)
            </span>
          )}
          
          {/* Texto de instrução quando não expandido */}
          {!isExpanded && (
            <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors hidden md:block">
              Clique para expandir
            </span>
          )}
          
          {/* Ícone de expansão */}
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>      {/* Conteúdo expansível */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded 
          ? 'max-h-[500px] opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>        <div className="border-t border-app-border p-4 bg-gray-900/30">
          {/* Grid de filtros na horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {/* Status do Pedido */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status do Pedido
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full p-2 bg-app-dark border border-app-border rounded-lg text-white focus:border-app-primary focus:outline-none"
              >
                <option value="">Todos os status</option>
                {statusOptions.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={filters.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="SKU do produto"
                className="w-full p-2 bg-app-dark border border-app-border rounded-lg text-white placeholder-gray-500 focus:border-app-primary focus:outline-none"
              />
            </div>

            {/* Data de Emissão */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data de Emissão
              </label>
              <input
                type="date"
                value={filters.dataEmissao}
                onChange={(e) => handleInputChange('dataEmissao', e.target.value)}
                className="w-full p-2 bg-app-dark border border-app-border rounded-lg text-white focus:border-app-primary focus:outline-none"
              />
            </div>

            {/* Número do Pedido */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nº do Pedido
              </label>
              <input
                type="text"
                value={filters.numeroPedido}
                onChange={(e) => handleInputChange('numeroPedido', e.target.value)}
                placeholder="Número do pedido"
                className="w-full p-2 bg-app-dark border border-app-border rounded-lg text-white placeholder-gray-500 focus:border-app-primary focus:outline-none"
              />
            </div>
          </div>            {/* Botões de ação */}
          <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-app-border/50">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all duration-300 text-sm border border-gray-600 hover:border-gray-500"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpar Filtros
              </span>
            </button>
            
            <button
              onClick={handleFilter}
              className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-500 transition-all duration-300 text-sm border border-gray-500 hover:border-gray-400"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Aplicar Filtros
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
