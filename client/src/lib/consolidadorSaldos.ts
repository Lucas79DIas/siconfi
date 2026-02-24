/**
 * Consolidador de Saldos Finais/Iniciais
 * Compara saldos finais do mês anterior com saldos iniciais do mês atual
 * Usa chave composta: CONTA + IC1-IC6 + TIPO1-TIPO6
 */

export interface SaldoConta {
  chaveComposta: string; // Identificador único da linha
  conta: string;
  ic1: string;
  tipo1: string;
  ic2: string;
  tipo2: string;
  ic3: string;
  tipo3: string;
  ic4: string;
  tipo4: string;
  ic5: string;
  tipo5: string;
  ic6: string;
  tipo6: string;
  saldoInicial: string;
  saldoFinal: string;
}

export interface DivergenciaSaldo {
  chaveComposta: string;
  conta: string;
  ic1: string;
  tipo1: string;
  ic2: string;
  tipo2: string;
  ic3: string;
  tipo3: string;
  ic4: string;
  tipo4: string;
  ic5: string;
  tipo5: string;
  ic6: string;
  tipo6: string;
  saldoFinalMesAnterior: string;
  saldoInicialMesAtual: string;
  diferenca: number;
}

/**
 * Cria chave composta a partir dos campos identificadores
 */
function criarChaveComposta(
  conta: string,
  ic1: string,
  tipo1: string,
  ic2: string,
  tipo2: string,
  ic3: string,
  tipo3: string,
  ic4: string,
  tipo4: string,
  ic5: string,
  tipo5: string,
  ic6: string,
  tipo6: string
): string {
  return `${conta}|${ic1}|${tipo1}|${ic2}|${tipo2}|${ic3}|${tipo3}|${ic4}|${tipo4}|${ic5}|${tipo5}|${ic6}|${tipo6}`;
}

/**
 * Processa arquivo CSV da matriz de saldos e extrai saldos iniciais e finais
 * Estrutura esperada:
 * - Cabeçalho: CONTA;IC1;TIPO1;IC2;TIPO2;IC3;TIPO3;IC4;TIPO4;IC5;TIPO5;IC6;TIPO6;...;Valor;Tipo_valor;Natureza_valor
 * - Filtra por Tipo_valor = "beginning_balance" e "ending_balance"
 */
export function processarMatrizSaldosConsolidacao(conteudoCSV: string): Map<string, SaldoConta> {
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
  const indiceIC1 = cabecalho.indexOf('IC1');
  const indiceTIPO1 = cabecalho.indexOf('TIPO1');
  const indiceIC2 = cabecalho.indexOf('IC2');
  const indiceTIPO2 = cabecalho.indexOf('TIPO2');
  const indiceIC3 = cabecalho.indexOf('IC3');
  const indiceTIPO3 = cabecalho.indexOf('TIPO3');
  const indiceIC4 = cabecalho.indexOf('IC4');
  const indiceTIPO4 = cabecalho.indexOf('TIPO4');
  const indiceIC5 = cabecalho.indexOf('IC5');
  const indiceTIPO5 = cabecalho.indexOf('TIPO5');
  const indiceIC6 = cabecalho.indexOf('IC6');
  const indiceTIPO6 = cabecalho.indexOf('TIPO6');
  const indiceTipoValor = cabecalho.indexOf('Tipo_valor');
  const indiceValor = cabecalho.indexOf('Valor');

  if (indiceConta === -1) {
    throw new Error('Campo "CONTA" não encontrado no arquivo de matriz');
  }

  if (indiceTipoValor === -1) {
    throw new Error('Campo "Tipo_valor" não encontrado no arquivo de matriz');
  }

  if (indiceValor === -1) {
    throw new Error('Campo "Valor" não encontrado no arquivo de matriz');
  }

  // Mapa para armazenar os saldos de cada linha (usando chave composta)
  const contasMap = new Map<string, { 
    conta: string;
    ic1: string;
    tipo1: string;
    ic2: string;
    tipo2: string;
    ic3: string;
    tipo3: string;
    ic4: string;
    tipo4: string;
    ic5: string;
    tipo5: string;
    ic6: string;
    tipo6: string;
    inicial?: string; 
    final?: string 
  }>();

  // Processar linhas de dados (começar após cabeçalho)
  for (let i = indiceCabecalho + 1; i < linhas.length; i++) {
    const campos = linhas[i].split(';').map(campo => campo.trim());
    
    if (campos.length <= Math.max(indiceConta, indiceTipoValor, indiceValor)) {
      continue; // Linha incompleta
    }

    const conta = campos[indiceConta];
    const ic1 = indiceIC1 !== -1 ? campos[indiceIC1] : '';
    const tipo1 = indiceTIPO1 !== -1 ? campos[indiceTIPO1] : '';
    const ic2 = indiceIC2 !== -1 ? campos[indiceIC2] : '';
    const tipo2 = indiceTIPO2 !== -1 ? campos[indiceTIPO2] : '';
    const ic3 = indiceIC3 !== -1 ? campos[indiceIC3] : '';
    const tipo3 = indiceTIPO3 !== -1 ? campos[indiceTIPO3] : '';
    const ic4 = indiceIC4 !== -1 ? campos[indiceIC4] : '';
    const tipo4 = indiceTIPO4 !== -1 ? campos[indiceTIPO4] : '';
    const ic5 = indiceIC5 !== -1 ? campos[indiceIC5] : '';
    const tipo5 = indiceTIPO5 !== -1 ? campos[indiceTIPO5] : '';
    const ic6 = indiceIC6 !== -1 ? campos[indiceIC6] : '';
    const tipo6 = indiceTIPO6 !== -1 ? campos[indiceTIPO6] : '';
    const tipoValor = campos[indiceTipoValor];
    const valor = campos[indiceValor];

    // Ignorar linhas onde conta contém letras (apenas números)
    if (/[a-zA-Z]/.test(conta)) {
      continue;
    }

    // Ignorar linhas vazias
    if (!conta) {
      continue;
    }

    // Criar chave composta
    const chaveComposta = criarChaveComposta(conta, ic1, tipo1, ic2, tipo2, ic3, tipo3, ic4, tipo4, ic5, tipo5, ic6, tipo6);

    // Obter ou criar entrada da chave composta
    if (!contasMap.has(chaveComposta)) {
      contasMap.set(chaveComposta, {
        conta,
        ic1,
        tipo1,
        ic2,
        tipo2,
        ic3,
        tipo3,
        ic4,
        tipo4,
        ic5,
        tipo5,
        ic6,
        tipo6
      });
    }
    const saldos = contasMap.get(chaveComposta)!;

    // Processar saldo inicial e final
    if (tipoValor === 'beginning_balance') {
      saldos.inicial = valor;
    } else if (tipoValor === 'ending_balance') {
      saldos.final = valor;
    }
  }

  // Converter para formato final
  const resultado = new Map<string, SaldoConta>();
  for (const [chaveComposta, saldos] of contasMap) {
    resultado.set(chaveComposta, {
      chaveComposta,
      conta: saldos.conta,
      ic1: saldos.ic1,
      tipo1: saldos.tipo1,
      ic2: saldos.ic2,
      tipo2: saldos.tipo2,
      ic3: saldos.ic3,
      tipo3: saldos.tipo3,
      ic4: saldos.ic4,
      tipo4: saldos.tipo4,
      ic5: saldos.ic5,
      tipo5: saldos.tipo5,
      ic6: saldos.ic6,
      tipo6: saldos.tipo6,
      saldoInicial: saldos.inicial || '0',
      saldoFinal: saldos.final || '0'
    });
  }

  return resultado;
}

/**
 * Compara saldos finais do mês anterior com saldos iniciais do mês atual
 * Usa chave composta para identificação única
 * Retorna apenas as contas com divergências
 */
export function identificarDivergenciasSaldos(
  saldosMesAnterior: Map<string, SaldoConta>,
  saldosMesAtual: Map<string, SaldoConta>
): DivergenciaSaldo[] {
  const divergencias: DivergenciaSaldo[] = [];

  // Para cada linha do mês atual, verificar se o saldo inicial corresponde ao saldo final do mês anterior
  for (const [chaveComposta, saldosAtual] of saldosMesAtual) {
    const saldosAnterior = saldosMesAnterior.get(chaveComposta);

    if (!saldosAnterior) {
      // Linha não existe no mês anterior - pode ser uma linha nova
      // Verificar se o saldo inicial é diferente de zero
      const saldoInicialNum = parseFloat(saldosAtual.saldoInicial.replace(',', '.'));
      if (saldoInicialNum !== 0) {
        divergencias.push({
          chaveComposta,
          conta: saldosAtual.conta,
          ic1: saldosAtual.ic1,
          tipo1: saldosAtual.tipo1,
          ic2: saldosAtual.ic2,
          tipo2: saldosAtual.tipo2,
          ic3: saldosAtual.ic3,
          tipo3: saldosAtual.tipo3,
          ic4: saldosAtual.ic4,
          tipo4: saldosAtual.tipo4,
          ic5: saldosAtual.ic5,
          tipo5: saldosAtual.tipo5,
          ic6: saldosAtual.ic6,
          tipo6: saldosAtual.tipo6,
          saldoFinalMesAnterior: 'Linha não encontrada',
          saldoInicialMesAtual: saldosAtual.saldoInicial,
          diferenca: saldoInicialNum
        });
      }
      continue;
    }

    // Comparar saldo final do mês anterior com saldo inicial do mês atual
    const saldoFinalAnterior = parseFloat(saldosAnterior.saldoFinal.replace(',', '.'));
    const saldoInicialAtual = parseFloat(saldosAtual.saldoInicial.replace(',', '.'));

    // Considerar divergência se houver diferença (com tolerância para arredondamento)
    const diferenca = Math.abs(saldoFinalAnterior - saldoInicialAtual);
    if (diferenca > 0.01) {
      divergencias.push({
        chaveComposta,
        conta: saldosAtual.conta,
        ic1: saldosAtual.ic1,
        tipo1: saldosAtual.tipo1,
        ic2: saldosAtual.ic2,
        tipo2: saldosAtual.tipo2,
        ic3: saldosAtual.ic3,
        tipo3: saldosAtual.tipo3,
        ic4: saldosAtual.ic4,
        tipo4: saldosAtual.tipo4,
        ic5: saldosAtual.ic5,
        tipo5: saldosAtual.tipo5,
        ic6: saldosAtual.ic6,
        tipo6: saldosAtual.tipo6,
        saldoFinalMesAnterior: saldosAnterior.saldoFinal,
        saldoInicialMesAtual: saldosAtual.saldoInicial,
        diferenca: saldoInicialAtual - saldoFinalAnterior
      });
    }
  }

  // Verificar linhas que existem no mês anterior mas não no mês atual (e têm saldo final diferente de zero)
  for (const [chaveComposta, saldosAnterior] of saldosMesAnterior) {
    if (!saldosMesAtual.has(chaveComposta)) {
      const saldoFinalNum = parseFloat(saldosAnterior.saldoFinal.replace(',', '.'));
      if (saldoFinalNum !== 0) {
        divergencias.push({
          chaveComposta,
          conta: saldosAnterior.conta,
          ic1: saldosAnterior.ic1,
          tipo1: saldosAnterior.tipo1,
          ic2: saldosAnterior.ic2,
          tipo2: saldosAnterior.tipo2,
          ic3: saldosAnterior.ic3,
          tipo3: saldosAnterior.tipo3,
          ic4: saldosAnterior.ic4,
          tipo4: saldosAnterior.tipo4,
          ic5: saldosAnterior.ic5,
          tipo5: saldosAnterior.tipo5,
          ic6: saldosAnterior.ic6,
          tipo6: saldosAnterior.tipo6,
          saldoFinalMesAnterior: saldosAnterior.saldoFinal,
          saldoInicialMesAtual: 'Linha não encontrada',
          diferenca: -saldoFinalNum
        });
      }
    }
  }

  return divergencias;
}

/**
 * Gera CSV com divergências de saldos
 */
export function gerarCSVDivergenciasSaldos(divergencias: DivergenciaSaldo[]): string {
  const cabecalho = 'Conta;IC1;TIPO1;IC2;TIPO2;IC3;TIPO3;IC4;TIPO4;IC5;TIPO5;IC6;TIPO6;Saldo Final Mês Anterior;Saldo Inicial Mês Atual;Diferença';
  const linhas = divergencias.map(
    item => `${item.conta};${item.ic1};${item.tipo1};${item.ic2};${item.tipo2};${item.ic3};${item.tipo3};${item.ic4};${item.tipo4};${item.ic5};${item.tipo5};${item.ic6};${item.tipo6};${item.saldoFinalMesAnterior};${item.saldoInicialMesAtual};${item.diferenca.toFixed(2)}`
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
