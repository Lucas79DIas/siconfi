/**
 * CSV Processor para verificação de naturezas contábeis
 * Design: Minimalismo Corporativo Moderno
 * Foco: Clareza máxima na lógica de processamento
 * 
 * Estrutura real dos arquivos:
 * - CSV_Siconfi: Matriz com múltiplas linhas por conta, filtrando por ending_balance
 * - NaturezaPCASP: Arquivo simples com conta e natureza esperada
 */

export interface ContaMatriz {
  conta: string;
  naturezaEncontrada: string;
}

export interface ContaPCAP {
  conta: string;
  naturezaCorreta: string;
}

export interface DivergenciaContabil {
  conta: string;
  naturezaEncontrada: string;
  naturezaCorreta: string;
}

/**
 * Processa arquivo CSV da matriz de saldos (CSV_Siconfi)
 * Estrutura esperada:
 * - Cabeçalho: CONTA;IC1;TIPO1;...;Valor;Tipo_valor;Natureza_valor
 * - Filtra por Tipo_valor = "ending_balance"
 * - Extrai: CONTA (primeira coluna) e Natureza_valor (última coluna)
 */
export function processarMatrizSaldos(conteudoCSV: string): ContaMatriz[] {
  const linhas = conteudoCSV.split('\n').filter(linha => linha.trim());
  
  if (linhas.length === 0) {
    throw new Error('Arquivo de matriz vazio');
  }

  // Encontrar a linha de cabeçalho (começa com CONTA)
  let indiceCabecalho = 0;
  for (let i = 0; i < linhas.length; i++) {
    if (linhas[i].trim().startsWith('CONTA')) {
      indiceCabecalho = i;
      break;
    }
  }

  // Encontrar índices dos campos
  const cabecalho = linhas[indiceCabecalho].split(';').map(campo => campo.trim());
  const indiceConta = cabecalho.indexOf('CONTA');
  const indiceTipoValor = cabecalho.indexOf('Tipo_valor');
  const indiceNaturezaValor = cabecalho.indexOf('Natureza_valor');

  if (indiceConta === -1) {
    throw new Error('Campo "CONTA" não encontrado no arquivo de matriz');
  }

  if (indiceTipoValor === -1) {
    throw new Error('Campo "Tipo_valor" não encontrado no arquivo de matriz');
  }

  if (indiceNaturezaValor === -1) {
    throw new Error('Campo "Natureza_valor" não encontrado no arquivo de matriz');
  }

  // Mapa para armazenar o ending_balance de cada conta
  const contasMap = new Map<string, string>();

  // Processar linhas de dados (começar após cabeçalho)
  for (let i = indiceCabecalho + 1; i < linhas.length; i++) {
    const campos = linhas[i].split(';').map(campo => campo.trim());
    
    if (campos.length <= Math.max(indiceConta, indiceTipoValor, indiceNaturezaValor)) {
      continue; // Linha incompleta
    }

    const conta = campos[indiceConta];
    const tipoValor = campos[indiceTipoValor];
    const naturezaValor = campos[indiceNaturezaValor];

    // Ignorar linhas onde conta contém letras (apenas números)
    if (/[a-zA-Z]/.test(conta)) {
      continue;
    }

    // Ignorar linhas vazias
    if (!conta) {
      continue;
    }

    // Processar apenas linhas com ending_balance
    if (tipoValor === 'ending_balance' && naturezaValor) {
      // Se a conta já existe no mapa, sobrescrever (pega o último ending_balance)
      contasMap.set(conta, naturezaValor);
    }
  }

  // Converter mapa para array
  const contas: ContaMatriz[] = Array.from(contasMap).map(([conta, natureza]) => ({
    conta,
    naturezaEncontrada: natureza
  }));

  return contas;
}

/**
 * Processa arquivo CSV de naturezas PCASP
 * Formato: Conta;Natureza correta (sem cabeçalho ou com cabeçalho)
 */
export function processarNaturezasPCAP(conteudoCSV: string): ContaPCAP[] {
  const linhas = conteudoCSV.split('\n').filter(linha => linha.trim());
  
  if (linhas.length === 0) {
    throw new Error('Arquivo de naturezas PCASP vazio');
  }

  const contas: ContaPCAP[] = [];

  // Detectar se primeira linha é cabeçalho
  const primeiraLinha = linhas[0].split(';').map(campo => campo.trim());
  const inicioProcessamento = 
    (primeiraLinha[0].toLowerCase() === 'conta' || 
     primeiraLinha[0].toLowerCase() === 'conta;natureza correta' ||
     primeiraLinha[0].toLowerCase() === 'conta;natureza')
      ? 1 
      : 0;

  for (let i = inicioProcessamento; i < linhas.length; i++) {
    const campos = linhas[i].split(';').map(campo => campo.trim());
    
    if (campos.length < 2) {
      continue; // Linha incompleta
    }

    const conta = campos[0];
    const naturezaCorreta = campos[1];

    // Ignorar linhas onde conta contém letras
    if (/[a-zA-Z]/.test(conta)) {
      continue;
    }

    if (conta && naturezaCorreta) {
      contas.push({
        conta,
        naturezaCorreta
      });
    }
  }

  return contas;
}

/**
 * Verifica se a natureza encontrada eh valida para a natureza correta
 * Regra especial: Se naturezaCorreta for C/D, ambos C e D sao validos
 */
function isNaturezaValida(naturezaEncontrada: string, naturezaCorreta: string): boolean {
  // Se a natureza correta eh C/D, aceita tanto C quanto D
  if (naturezaCorreta === 'C/D') {
    return naturezaEncontrada === 'C' || naturezaEncontrada === 'D';
  }
  
  // Caso contrario, deve ser exatamente igual
  return naturezaEncontrada === naturezaCorreta;
}

/**
 * Compara matriz de saldos com naturezas PCASP
 * Retorna apenas as contas com divergencias
 * Considera C/D como valido para ambos C e D
 */
export function identificarDivergencias(
  matrizSaldos: ContaMatriz[],
  naturezasPCAP: ContaPCAP[]
): DivergenciaContabil[] {
  // Criar mapa de naturezas para busca rápida
  const mapaNaturezas = new Map(
    naturezasPCAP.map(item => [item.conta, item.naturezaCorreta])
  );

  const divergencias: DivergenciaContabil[] = [];

  // Comparar cada conta da matriz
  for (const conta of matrizSaldos) {
    const naturezaCorreta = mapaNaturezas.get(conta.conta);

    if (!naturezaCorreta) {
      // Conta nao encontrada no arquivo PCASP - pode ser ignorada ou reportada
      continue;
    }

    // Verificar se a natureza eh valida
    if (!isNaturezaValida(conta.naturezaEncontrada, naturezaCorreta)) {
      divergencias.push({
        conta: conta.conta,
        naturezaEncontrada: conta.naturezaEncontrada,
        naturezaCorreta: naturezaCorreta
      });
    }
  }

  return divergencias;
}

/**
 * Gera CSV com contas que possuem natureza errada
 */
export function gerarCSVDivergencias(divergencias: DivergenciaContabil[]): string {
  const cabecalho = 'Conta;Natureza Encontrada;Natureza Correta';
  const linhas = divergencias.map(
    item => `${item.conta};${item.naturezaEncontrada};${item.naturezaCorreta}`
  );

  return [cabecalho, ...linhas].join('\n');
}

/**
 * Faz download de um arquivo CSV
 */
export function baixarCSV(conteudo: string, nomeArquivo: string): void {
  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
