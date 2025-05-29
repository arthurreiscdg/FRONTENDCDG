import React, { useState } from 'react';

/**
 * Painel de filtros para pedidos da Montink
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onFilter - Callback para aplicar filtros
 * @param {Array} props.statusOptions - Opções de status disponíveis
 */
function FilterPanel({ onFilter, statusOptions = [] }) {
  const [filters, setFilters] = useState({
    status: '',
    sku: '',
    dataEmissao: '',
    numeroPedido: '',
    nomeCliente: ''
  });

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      sku: '',
      dataEmissao: '',
      numeroPedido: '',
      nomeCliente: ''
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <div className="w-80 bg-app-card border border-app-border rounded-lg p-4 h-fit">
      <h3 className="text-lg font-semibold text-app-primary mb-4 border-b border-app-border pb-2">
        Filtrar
      </h3>
      
      <div className="space-y-4">
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
            <option value="">Selecione uma opção...</option>
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
            placeholder="Informe o SKU"
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
            Número do Pedido
          </label>
          <input
            type="text"
            value={filters.numeroPedido}
            onChange={(e) => handleInputChange('numeroPedido', e.target.value)}
            placeholder="Informe o número do pedido"
            className="w-full p-2 bg-app-dark border border-app-border rounded-lg text-white placeholder-gray-500 focus:border-app-primary focus:outline-none"
          />
        </div>

        {/* Nome do Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nome do Cliente
          </label>
          <input
            type="text"
            value={filters.nomeCliente}
            onChange={(e) => handleInputChange('nomeCliente', e.target.value)}
            placeholder="Nome do cliente"
            className="w-full p-2 bg-app-dark border border-app-border rounded-lg text-white placeholder-gray-500 focus:border-app-primary focus:outline-none"
          />
        </div>

        {/* Botões */}
        <div className="space-y-2 pt-4">
          <button
            onClick={handleFilter}
            className="w-full py-2 px-4 bg-app-primary text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Filtrar
          </button>
          
          <button
            onClick={handleClearFilters}
            className="w-full py-2 px-4 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
