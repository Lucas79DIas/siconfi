import { processarMatrizSaldosConsolidacao, identificarDivergenciasSaldos, gerarCSVDivergenciasSaldos } from './consolidadorDeSaldos';
import { processarMatrizSaldos, processarNaturezasPCAP, identificarDivergencias, gerarCSVDivergencias } from './verificadorNatureza';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const { csvMesAnterior, csvMesAtual, csvMatrizSaldos, csvNaturezaPCASP } = body;

    // Consolidador de saldos
    const saldosAnterior = processarMatrizSaldosConsolidacao(csvMesAnterior);
    const saldosAtual = processarMatrizSaldosConsolidacao(csvMesAtual);
    const divergenciasSaldos = identificarDivergenciasSaldos(saldosAnterior, saldosAtual);
    const csvDivergenciasSaldos = gerarCSVDivergenciasSaldos(divergenciasSaldos);

    // Verificação de naturezas
    const matrizSaldos = processarMatrizSaldos(csvMatrizSaldos);
    const naturezasPCAP = processarNaturezasPCAP(csvNaturezaPCASP);
    const divergenciasNatureza = identificarDivergencias(matrizSaldos, naturezasPCAP);
    const csvDivergenciasNatureza = gerarCSVDivergencias(divergenciasNatureza);

    return new Response(JSON.stringify({ csvDivergenciasSaldos, csvDivergenciasNatureza }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(err);
    return new Response('Erro interno', { status: 500 });
  }
}
