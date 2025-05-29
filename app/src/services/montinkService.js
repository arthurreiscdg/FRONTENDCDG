const API_URL = import.meta.env.VITE_API_URL;

/**
 * Serviço para gerenciar pedidos da Montink
 */
export const montinkService = {  /**
   * Busca todos os pedidos com filtros opcionais
   * @param {Object} filters - Filtros a serem aplicados
   * @param {number} page - Página atual
   * @param {number} limit - Limite de itens por página
   * @returns {Promise<Object>} Lista de pedidos e metadados
   */
  async getPedidos(filters = {}, page = 1, limit = 15) {
    const queryParams = new URLSearchParams();
    
    // Adiciona filtros à query string
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const response = await fetch(`${API_URL}/pedidos?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Para enviar cookies de autenticação
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos');
    }

    return response.json();
  },
  /**
   * Busca um pedido específico por ID
   * @param {number} id - ID do pedido
   * @returns {Promise<Object>} Dados do pedido
   */
  async getPedidoById(id) {
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar pedido');
    }

    return response.json();
  },
  /**
   * Atualiza o status de um pedido
   * @param {number} id - ID do pedido
   * @param {number} statusId - ID do novo status
   * @returns {Promise<Object>} Pedido atualizado
   */
  async updatePedidoStatus(id, statusId) {
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ status_id: statusId })
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar status do pedido');
    }

    return response.json();
  },
  /**
   * Atualiza o status de múltiplos pedidos
   * @param {Array<number>} orderIds - IDs dos pedidos
   * @param {number} statusId - ID do novo status
   * @returns {Promise<Array>} Resultados das atualizações
   */
  async updateMultiplePedidosStatus(orderIds, statusId) {
    const response = await fetch(`${API_URL}/pedidos/bulk-update-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ 
        order_ids: orderIds,
        status_id: statusId 
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar status dos pedidos');
    }

    return response.json();
  },
  /**
   * Busca o histórico de status de um pedido
   * @param {number} id - ID do pedido
   * @returns {Promise<Array>} Histórico de status
   */
  async getPedidoHistory(id) {
    const response = await fetch(`${API_URL}/pedidos/${id}/historico`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar histórico do pedido');
    }

    return response.json();
  },
  /**
   * Busca todos os status de pedidos disponíveis
   * @returns {Promise<Array>} Lista de status
   */
  async getStatusOptions() {
    const response = await fetch(`${API_URL}/status-pedidos`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar status de pedidos');
    }

    return response.json();
  },
  /**
   * Gera e baixa PDFs dos pedidos selecionados
   * @param {Array<number>} orderIds - IDs dos pedidos
   * @returns {Promise<Blob>} Arquivo PDF
   */
  async downloadOrdersPDF(orderIds) {
    const response = await fetch(`${API_URL}/pedidos/download-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ order_ids: orderIds })
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar PDF dos pedidos');
    }

    return response.blob();
  },
  /**
   * Busca documentos relacionados a um pedido
   * @param {number} id - ID do pedido
   * @returns {Promise<Array>} Lista de documentos
   */
  async getPedidoDocuments(id) {
    const response = await fetch(`${API_URL}/pedidos/${id}/documentos`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar documentos do pedido');
    }

    return response.json();
  }
};

export default montinkService;
