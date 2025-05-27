// hooks/useExcelProcessor.js
import { useState } from 'react';
import * as XLSX from 'xlsx';

/**
 * Hook para processar arquivos Excel
 * @returns {Object} Métodos e estados para processamento de Excel
 */
export const useExcelProcessor = () => {
  const [processando, setProcessando] = useState(false);
  const [error, setError] = useState('');

  /**
   * Processa um arquivo Excel para extrair dados das colunas UNIDADES e QTDE
   * 
   * @param {File} file - O arquivo Excel a ser processado
   * @param {Array<string>} escolasValidas - Lista de escolas válidas para filtrar
   * @returns {Promise<Object>} Objeto com as escolas e suas quantidades
   */
  const processarArquivoExcel = async (file, escolasValidas) => {
    if (!file) return { error: 'Nenhum arquivo fornecido', data: {} };
    
    try {
      setProcessando(true);
      setError('');
      
      // Ler o arquivo como array buffer
      const buffer = await file.arrayBuffer();
      
      // Converter para o formato da biblioteca XLSX
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      // Assumir que os dados estão na primeira planilha
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Converter para JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Encontrar os índices das colunas UNIDADES e QTDE
      let unidadeColIndex = -1;
      let qtdeColIndex = -1;
      
      // Procurar os cabeçalhos nas primeiras 5 linhas (por segurança)
      for (let i = 0; i < Math.min(5, jsonData.length); i++) {
        const row = jsonData[i];
        if (!row) continue;
        
        for (let j = 0; j < row.length; j++) {
          const cell = String(row[j]).trim().toUpperCase();
          if (cell === 'UNIDADES') unidadeColIndex = j;
          if (cell === 'QTDE') qtdeColIndex = j;
        }
        
        // Se encontrou ambos os cabeçalhos, parar a busca
        if (unidadeColIndex !== -1 && qtdeColIndex !== -1) break;
      }
      
      // Verificar se encontrou os cabeçalhos
      if (unidadeColIndex === -1 || qtdeColIndex === -1) {
        setError('Formato inválido. A planilha deve conter as colunas "UNIDADES" e "QTDE".');
        return { error: 'Formato inválido', data: {} };
      }
      
      // Processar os dados das linhas a partir do cabeçalho
      const escolasQuantidades = {};
      let linhaInicio = 0;
      
      // Encontrar linha de início dos dados (após o cabeçalho)
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row) continue;
        
        if (String(row[unidadeColIndex]).trim().toUpperCase() === 'UNIDADES' && 
            String(row[qtdeColIndex]).trim().toUpperCase() === 'QTDE') {
          linhaInicio = i + 1;
          break;
        }
      }
      
      // Processar os dados
      for (let i = linhaInicio; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length <= Math.max(unidadeColIndex, qtdeColIndex)) continue;
        
        const unidade = String(row[unidadeColIndex]).trim().toUpperCase();
        const quantidade = row[qtdeColIndex];
          // Normalizar o nome da unidade para o formato usado pelo sistema
        let unidadeProcessada = unidade.replace(/ /g, '_');
        
        // Tentar encontrar a escola correspondente (mesmo com diferenças de formatação)
        const escolaCorrespondente = escolasValidas.find(escola => 
          escola === unidadeProcessada || 
          escola.toUpperCase() === unidadeProcessada.toUpperCase()
        );
        
        // Verificar se a unidade é válida e a quantidade é um número
        if (escolaCorrespondente && typeof quantidade === 'number' && quantidade > 0) {
          // Usar o nome exatamente como está na lista válida (preservar casing)
          escolasQuantidades[escolaCorrespondente] = quantidade;
        }
      }
      
      // Verificar se encontrou pelo menos uma escola com quantidade
      if (Object.keys(escolasQuantidades).length === 0) {
        setError('Nenhuma escola válida encontrada na planilha ou todas as quantidades são zero.');
        return { error: 'Nenhuma escola válida', data: {} };
      }
      
      return { 
        data: escolasQuantidades, 
        error: null,
        summary: {
          totalEscolas: Object.keys(escolasQuantidades).length,
          totalQuantidade: Object.values(escolasQuantidades).reduce((a, b) => a + b, 0)
        }
      };
      
    } catch (erro) {
      console.error('Erro ao processar arquivo Excel:', erro);
      setError('Erro ao processar o arquivo. Verifique se o formato está correto.');
      return { error: 'Erro de processamento', data: {} };
    } finally {
      setProcessando(false);
    }
  };

  /**
   * Valida o tipo de arquivo
   * @param {File} file 
   * @returns {boolean}
   */
  const isValidExcelFile = (file) => {
    if (!file) return false;

    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    // Aceitar arquivos Excel mesmo se o tipo MIME não for detectado corretamente
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(file.type) || ['xls', 'xlsx'].includes(fileExtension);
  };

  return {
    processando,
    error,
    setError,
    processarArquivoExcel,
    isValidExcelFile
  };
};
