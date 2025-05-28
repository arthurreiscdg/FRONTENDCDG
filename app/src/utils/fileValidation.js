/**
 * Utilitários para validação de arquivos PDF
 */

// Constantes de validação
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB em bytes
const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB total para múltiplos arquivos
const ALLOWED_TYPES = ['application/pdf'];
const ALLOWED_EXTENSIONS = ['.pdf'];

/**
 * Formatar tamanho de arquivo para exibição
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} Tamanho formatado
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Valida um único arquivo PDF
 * @param {File} file - Arquivo a ser validado
 * @returns {Object} Resultado da validação
 */
export function validateSingleFile(file) {
  if (!file) {
    return {
      isValid: false,
      message: 'Nenhum arquivo selecionado'
    };
  }
  
  // Verificar tipo do arquivo
  const isValidType = ALLOWED_TYPES.includes(file.type);
  const isValidExtension = ALLOWED_EXTENSIONS.some(ext => 
    file.name.toLowerCase().endsWith(ext.toLowerCase())
  );
  
  if (!isValidType && !isValidExtension) {
    return {
      isValid: false,
      message: 'Apenas arquivos PDF são permitidos'
    };
  }
  
  // Verificar tamanho do arquivo
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      message: `Arquivo muito grande. Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}. Tamanho atual: ${formatFileSize(file.size)}`
    };
  }
  
  return {
    isValid: true,
    message: 'Arquivo válido'
  };
}

/**
 * Valida uma lista de arquivos
 * @param {Array<File>} files - Lista de arquivos a serem validados
 * @returns {Object} Resultado da validação
 */
export function validateMultipleFiles(files) {
  if (!files || files.length === 0) {
    return {
      isValid: false,
      message: 'Pelo menos um arquivo PDF é obrigatório'
    };
  }
  
  let totalSize = 0;
  const errors = [];
  
  // Validar cada arquivo individualmente
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const validation = validateSingleFile(file);
    
    if (!validation.isValid) {
      errors.push(`Arquivo ${i + 1}: ${validation.message}`);
    } else {
      totalSize += file.size;
    }
  }
  
  // Verificar tamanho total
  if (totalSize > MAX_TOTAL_SIZE) {
    errors.push(`Tamanho total dos arquivos muito grande. Máximo: ${formatFileSize(MAX_TOTAL_SIZE)}. Total atual: ${formatFileSize(totalSize)}`);
  }
  
  return {
    isValid: errors.length === 0,
    message: errors.length === 0 ? 'Todos os arquivos são válidos' : errors.join('; '),
    errors: errors,
    totalSize: totalSize
  };
}

/**
 * Estima o tamanho após conversão para base64
 * @param {number} originalSize - Tamanho original em bytes
 * @returns {number} Tamanho estimado após conversão para base64
 */
export function estimateBase64Size(originalSize) {
  // Base64 aumenta o tamanho em aproximadamente 33%
  return Math.ceil(originalSize * 1.33);
}

/**
 * Valida se os arquivos podem ser enviados considerando a conversão para base64
 * @param {Array<File>} files - Lista de arquivos
 * @returns {Object} Resultado da validação
 */
export function validateFilesForUpload(files) {
  const basicValidation = validateMultipleFiles(files);
  
  if (!basicValidation.isValid) {
    return basicValidation;
  }
  
  // Estimar tamanho após conversão para base64
  const estimatedSize = estimateBase64Size(basicValidation.totalSize);
  
  // Verificar se o tamanho estimado ainda está dentro do limite
  if (estimatedSize > MAX_TOTAL_SIZE) {
    return {
      isValid: false,
      message: `Após conversão para base64, os arquivos ficarão muito grandes. Tamanho estimado: ${formatFileSize(estimatedSize)}. Máximo: ${formatFileSize(MAX_TOTAL_SIZE)}`
    };
  }
  
  return {
    isValid: true,
    message: 'Arquivos válidos para upload',
    totalSize: basicValidation.totalSize,
    estimatedSize: estimatedSize
  };
}

/**
 * Obtém informações sobre os limites de arquivo
 * @returns {Object} Informações sobre os limites
 */
export function getFileLimits() {
  return {
    maxFileSize: MAX_FILE_SIZE,
    maxTotalSize: MAX_TOTAL_SIZE,
    allowedTypes: ALLOWED_TYPES,
    allowedExtensions: ALLOWED_EXTENSIONS,
    maxFileSizeFormatted: formatFileSize(MAX_FILE_SIZE),
    maxTotalSizeFormatted: formatFileSize(MAX_TOTAL_SIZE)
  };
}
