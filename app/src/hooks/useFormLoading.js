import { useState, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar estados de loading
 * com funcionalidades avançadas para formulários
 */
export const useFormLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingSubmessage, setLoadingSubmessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  /**
   * Inicia o loading com mensagem personalizada
   */
  const startLoading = useCallback((
    message = 'Processando...',
    submessage = 'Aguarde enquanto processamos sua solicitação',
    withProgress = false
  ) => {
    setIsLoading(true);
    setLoadingMessage(message);
    setLoadingSubmessage(submessage);
    setShowProgress(withProgress);
    setProgress(0);
  }, []);

  /**
   * Para o loading
   */
  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
    setLoadingSubmessage('');
    setProgress(0);
    setShowProgress(false);
  }, []);

  /**
   * Atualiza o progresso (0-100)
   */
  const updateProgress = useCallback((newProgress) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  }, []);

  /**
   * Atualiza apenas a mensagem sem afetar o estado de loading
   */
  const updateMessage = useCallback((message, submessage = '') => {
    setLoadingMessage(message);
    if (submessage) {
      setLoadingSubmessage(submessage);
    }
  }, []);

  /**
   * Executa uma função assíncrona com loading automático
   */
  const withLoading = useCallback(async (
    asyncFunction,
    message = 'Processando...',
    submessage = 'Aguarde enquanto processamos sua solicitação'
  ) => {
    try {
      startLoading(message, submessage);
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  /**
   * Executa uma função assíncrona com loading e progresso
   */
  const withProgressLoading = useCallback(async (
    asyncFunction,
    message = 'Processando...',
    submessage = 'Aguarde enquanto processamos sua solicitação'
  ) => {
    try {
      startLoading(message, submessage, true);
      const result = await asyncFunction((progress) => updateProgress(progress));
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, updateProgress]);

  return {
    // Estados
    isLoading,
    loadingMessage,
    loadingSubmessage,
    progress,
    showProgress,
    
    // Métodos
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
    withLoading,
    withProgressLoading
  };
};

export default useFormLoading;
