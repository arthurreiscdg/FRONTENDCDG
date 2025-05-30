/**
 * Utilitários para validação de datas de entrega
 */

/**
 * Calcula a data da Páscoa para um determinado ano
 * @param {number} year - Ano
 * @returns {Date} Data da Páscoa
 */
function calcularPascoa(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = Math.floor((h + l - 7 * m + 114) / 31);
  const p = (h + l - 7 * m + 114) % 31;
  
  return new Date(year, n - 1, p + 1);
}

/**
 * Calcula feriados nacionais brasileiros para um determinado ano
 * @param {number} year - Ano
 * @returns {Array<Date>} Array com as datas dos feriados
 */
function getFeriadosNacionais(year) {
  const feriados = [];
  
  // Feriados fixos
  feriados.push(new Date(year, 0, 1));   // Confraternização Universal
  feriados.push(new Date(year, 3, 21));  // Tiradentes
  feriados.push(new Date(year, 4, 1));   // Dia do Trabalho
  feriados.push(new Date(year, 8, 7));   // Independência do Brasil
  feriados.push(new Date(year, 9, 12));  // Nossa Senhora Aparecida
  feriados.push(new Date(year, 10, 2));  // Finados
  feriados.push(new Date(year, 10, 15)); // Proclamação da República
  feriados.push(new Date(year, 11, 25)); // Natal
  
  // Feriados móveis baseados na Páscoa
  const pascoa = calcularPascoa(year);
  
  // Carnaval (47 dias antes da Páscoa)
  const carnaval1 = new Date(pascoa);
  carnaval1.setDate(pascoa.getDate() - 47);
  feriados.push(carnaval1);
  
  // Carnaval (46 dias antes da Páscoa)
  const carnaval2 = new Date(pascoa);
  carnaval2.setDate(pascoa.getDate() - 46);
  feriados.push(carnaval2);
  
  // Sexta-feira Santa (2 dias antes da Páscoa)
  const sextaFeiraSanta = new Date(pascoa);
  sextaFeiraSanta.setDate(pascoa.getDate() - 2);
  feriados.push(sextaFeiraSanta);
  
  // Corpus Christi (60 dias após a Páscoa)
  const corpusChristi = new Date(pascoa);
  corpusChristi.setDate(pascoa.getDate() + 60);
  feriados.push(corpusChristi);
  
  return feriados;
}

/**
 * Verifica se uma data é feriado nacional
 * @param {Date|string} date - Data a ser verificada
 * @returns {boolean} True se for feriado, false caso contrário
 */
export function isFeriado(date) {
  const dataVerificacao = typeof date === 'string' ? new Date(date) : new Date(date);
  const year = dataVerificacao.getFullYear();
  const feriados = getFeriadosNacionais(year);
  
  return feriados.some(feriado => {
    return feriado.getDate() === dataVerificacao.getDate() &&
           feriado.getMonth() === dataVerificacao.getMonth() &&
           feriado.getFullYear() === dataVerificacao.getFullYear();
  });
}

/**
 * Verifica se uma data é fim de semana
 * @param {Date|string} date - Data a ser verificada
 * @returns {boolean} True se for sábado ou domingo, false caso contrário
 */
export function isFimDeSemana(date) {
  const dataVerificacao = typeof date === 'string' ? new Date(date) : new Date(date);
  const diaSemana = dataVerificacao.getDay();
  return diaSemana === 0 || diaSemana === 6; // 0 = domingo, 6 = sábado
}

/**
 * Calcula a data mínima de entrega (7 dias úteis após hoje, excluindo feriados e fins de semana)
 * @returns {string} Data mínima no formato YYYY-MM-DD
 */
export function calcularDataMinimaEntrega() {
  const hoje = new Date();
  let dataAtual = new Date(hoje);
  let diasUteis = 0;
  
  // Contar 7 dias úteis a partir de hoje
  while (diasUteis < 7) {
    dataAtual.setDate(dataAtual.getDate() + 1);
    
    // Se não for fim de semana nem feriado, conta como dia útil
    if (!isFimDeSemana(dataAtual) && !isFeriado(dataAtual)) {
      diasUteis++;
    }
  }
  
  return dataAtual.toISOString().split('T')[0];
}

/**
 * Valida se uma data de entrega é válida (não é feriado, não é fim de semana, e é pelo menos 7 dias úteis após hoje)
 * @param {string} dataEntrega - Data de entrega no formato YYYY-MM-DD
 * @returns {Object} Resultado da validação
 */
export function validarDataEntrega(dataEntrega) {
  if (!dataEntrega) {
    return {
      isValid: false,
      message: 'Data de entrega é obrigatória'
    };
  }
  
  const data = new Date(dataEntrega);
  const hoje = new Date();
  
  // Resetar horas para comparação apenas de datas
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);
  
  // Calcular a data mínima real (7 dias úteis)
  const dataMinima = new Date(calcularDataMinimaEntrega());
  dataMinima.setHours(0, 0, 0, 0);
  
  // Verificar se a data é pelo menos 7 dias úteis no futuro
  if (data < dataMinima) {
    return {
      isValid: false,
      message: 'A data de entrega deve ser pelo menos 7 dias úteis após hoje'
    };
  }
  
  // Verificar se é fim de semana
  if (isFimDeSemana(data)) {
    return {
      isValid: false,
      message: 'Não é possível agendar entregas para fins de semana'
    };
  }
  
  // Verificar se é feriado
  if (isFeriado(data)) {
    return {
      isValid: false,
      message: 'Não é possível agendar entregas para feriados nacionais'
    };
  }
  
  return {
    isValid: true,
    message: 'Data de entrega válida'
  };
}

/**
 * Obtém a próxima data útil válida (não feriado, não fim de semana)
 * @param {Date} startDate - Data inicial
 * @returns {Date} Próxima data útil válida
 */
export function obterProximaDataUtil(startDate) {
  let data = new Date(startDate);
  
  while (isFimDeSemana(data) || isFeriado(data)) {
    data.setDate(data.getDate() + 1);
  }
  
  return data;
}

/**
 * Calcula a data mínima de entrega considerando apenas dias úteis
 * @returns {string} Data mínima útil no formato YYYY-MM-DD
 */
export function calcularDataMinimaEntregaUtil() {
  // Esta função agora é a mesma que calcularDataMinimaEntrega
  // pois ambas já calculam apenas dias úteis
  return calcularDataMinimaEntrega();
}

/**
 * Obtém lista de datas sugeridas válidas para entrega (próximos 10 dias úteis)
 * @returns {Array<Object>} Array com datas sugeridas no formato { date: 'YYYY-MM-DD', label: 'DD/MM/YYYY - Dia da semana' }
 */
export function obterDatasSugeridas() {
  const hoje = new Date();
  let dataAtual = new Date(hoje);
  let diasUteis = 0;
  
  const sugestoes = [];
  
  // Primeiro, avançar para a data mínima (7 dias úteis)
  while (diasUteis < 7) {
    dataAtual.setDate(dataAtual.getDate() + 1);
    
    if (!isFimDeSemana(dataAtual) && !isFeriado(dataAtual)) {
      diasUteis++;
    }
  }
  
  // Agora coletar as próximas 10 datas úteis válidas a partir da data mínima
  let countSugestoes = 0;
  
  while (countSugestoes < 10) {
    if (!isFimDeSemana(dataAtual) && !isFeriado(dataAtual)) {
      const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const diaSemana = diasSemana[dataAtual.getDay()];
      
      sugestoes.push({
        date: dataAtual.toISOString().split('T')[0],
        label: `${dataAtual.getDate().toString().padStart(2, '0')}/${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}/${dataAtual.getFullYear()} - ${diaSemana}`
      });
      
      countSugestoes++;
    }
    
    dataAtual.setDate(dataAtual.getDate() + 1);
  }
  
  return sugestoes;
}

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY sem problemas de timezone
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {string} Data formatada no formato DD/MM/YYYY
 */
export function formatarDataBrasileira(dateString) {
  if (!dateString) return '';
  
  // Parse da string YYYY-MM-DD diretamente sem usar new Date()
  // para evitar problemas de timezone
  const [year, month, day] = dateString.split('-');
  
  // Validar se os valores são válidos
  if (!year || !month || !day) return '';
  
  // Formatar como DD/MM/YYYY
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}
