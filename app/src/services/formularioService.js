// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Serviço para operações relacionadas a formulários
 */

/**
 * Converte um arquivo para base64
 * @param {File} file - Arquivo a ser convertido
 * @returns {Promise<string>} String base64 do arquivo
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove o prefixo "data:application/pdf;base64," para enviar apenas o base64
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Valida os dados do formulário antes do envio
 * @param {Object} formData - Dados do formulário
 * @returns {Object} Resultado da validação
 */
function validateFormData(formData) {
  const errors = [];

  // Validações obrigatórias
  if (!formData.nome?.trim()) {
    errors.push('Nome é obrigatório');
  }

  if (!formData.email?.trim()) {
    errors.push('Email é obrigatório');
  }

  if (!formData.titulo?.trim()) {
    errors.push('Título do trabalho é obrigatório');
  }

  if (!formData.dataEntrega) {
    errors.push('Data de entrega é obrigatória');
  }  // Validação de PDFs
  if (!formData.pdfs || !Array.isArray(formData.pdfs) || formData.pdfs.length === 0) {
    errors.push('Pelo menos um arquivo PDF é obrigatório');
  }

  // Validação de escolas/quantidades
  if (!formData.escolasQuantidades || Object.keys(formData.escolasQuantidades).length === 0) {
    errors.push('Pelo menos uma escola com quantidade é obrigatória');
  }

  // Validação de quantidades
  if (formData.escolasQuantidades) {
    const hasInvalidQuantity = Object.values(formData.escolasQuantidades).some(
      qty => !qty || qty <= 0
    );
    if (hasInvalidQuantity) {
      errors.push('Todas as quantidades devem ser maiores que zero');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Prepara os dados do formulário para envio ao backend
 * @param {Object} formData - Dados do formulário do frontend
 * @param {Array} pdfFiles - Array de arquivos PDF (File objects)
 * @returns {Promise<Object>} Dados preparados para o backend
 */
async function prepareFormDataForSubmission(formData, pdfFiles = []) {
  try {
    console.log('Preparando dados - pdfFiles recebidos:', pdfFiles);
    
    // Converter PDFs para base64
    const pdfsWithBase64 = await Promise.all(
      pdfFiles.map(async (pdfFile) => {
        console.log('Processando PDF:', pdfFile);
        const base64 = await fileToBase64(pdfFile.file);        return {
          nome: pdfFile.nome || pdfFile.name, // Suportar ambas as estruturas
          tamanho: pdfFile.tamanho || pdfFile.size, // Manter em bytes
          tipo: pdfFile.tipo || pdfFile.file.type,
          base64: base64
        };
      })
    );

    console.log('PDFs convertidos para base64:', pdfsWithBase64.length);

    // Estrutura final para o backend
    const preparedData = {
      metodoPedido: formData.metodoPedido,
      titulo: formData.titulo,
      dataEntrega: formData.dataEntrega,
      observacoes: formData.observacoes || '',
      formatoFinal: formData.formatoFinal,
      corImpressao: formData.corImpressao,
      impressao: formData.impressao,
      gramatura: formData.gramatura,
      grampos: formData.grampos,
      nome: formData.nome,
      email: formData.email,
      origemDados: formData.origemDados || formData.metodoPedido,
      pdfs: pdfsWithBase64,
      escolasQuantidades: formData.escolasQuantidades
    };

    return preparedData;
  } catch (error) {
    console.error('Erro ao preparar dados do formulário:', error);
    throw new Error('Erro ao processar arquivos PDF');
  }
}

/**
 * Envia o formulário para o backend com callbacks de progresso
 * @param {Object} formData - Dados do formulário
 * @param {Array} pdfFiles - Array de arquivos PDF
 * @param {Function} onProgress - Callback para atualizar progresso (0-100)
 * @param {Function} onStatusUpdate - Callback para atualizar mensagem de status
 * @returns {Promise<Object>} Resposta do servidor
 */
export async function submitFormulario(formData, pdfFiles = [], onProgress = null, onStatusUpdate = null) {
  try {
    // Etapa 1: Validação (10%)
    onProgress?.(5);
    onStatusUpdate?.('Validando dados do formulário...');
    
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors.join(', '),
        errors: validation.errors
      };
    }

    onProgress?.(10);

    // Etapa 2: Preparação dos dados (30%)
    onStatusUpdate?.('Processando arquivos PDF...');
    onProgress?.(20);
    
    const preparedData = await prepareFormDataForSubmission(formData, pdfFiles);
    onProgress?.(30);

    // Etapa 3: Envio para o servidor (60%)
    onStatusUpdate?.('Enviando dados para o servidor...');
    onProgress?.(40);    const response = await fetch(`${API_BASE_URL}/formularios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Para enviar cookies de autenticação
      body: JSON.stringify(preparedData),
    });

    onProgress?.(70);
    onStatusUpdate?.('Processando resposta do servidor...');

    const data = await response.json();
    onProgress?.(80);

    if (!response.ok) {
      return {
        success: false,
        message: data.mensagem || 'Erro ao enviar formulário',
        statusCode: response.status
      };
    }

    // Etapa 4: Upload para Google Drive (90%)
    onStatusUpdate?.('Finalizando upload dos arquivos...');
    onProgress?.(90);

    // Simular tempo de processamento final
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onProgress?.(100);
    onStatusUpdate?.('Formulário enviado com sucesso!');

    return {
      success: true,
      message: 'Formulário enviado com sucesso!',
      data: data
    };

  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    
    // Tratar diferentes tipos de erro
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Erro de conexão com o servidor. Verifique sua internet e tente novamente.'
      };
    }

    return {
      success: false,
      message: error.message || 'Erro interno ao enviar formulário'
    };
  }
}

/**
 * Lista todos os formulários do usuário
 * @returns {Promise<Object>} Lista de formulários
 */
export async function listarFormularios() {
  try {
    const response = await fetch(`${API_BASE_URL}/formularios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.mensagem || 'Erro ao carregar formulários'
      };
    }

    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('Erro ao listar formulários:', error);
    return {
      success: false,
      message: 'Erro de conexão ao carregar formulários'
    };
  }
}

/**
 * Obtém um formulário específico por ID
 * @param {string} id - ID do formulário
 * @returns {Promise<Object>} Dados do formulário
 */
export async function obterFormulario(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/formularios/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.mensagem || 'Erro ao carregar formulário'
      };
    }

    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('Erro ao obter formulário:', error);
    return {
      success: false,
      message: 'Erro de conexão ao carregar formulário'
    };
  }
}

export default {
  submitFormulario,
  listarFormularios,
  obterFormulario
};
