// api/verificador.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processarMatrizSaldosConsolidacao, identificarDivergenciasSaldos, gerarCSVDivergenciasSaldos } from './consolidador-de-saldos';
import { processarMatrizSaldos, processarNaturezasPCAP, identificarDivergencias, gerarCSVDivergencias } from './verificador-natureza';

// Para simplificar, vamos assumir que recebemos CSVs como texto no corpo JSON
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido, use POST' });
  }

  try {
    const { csvMesAnterior, csvMesAtual, csvNaturezaPCASP, csvMatrizSaldos } = req.body;

    if (!csvMesAnterior || !csvMesAtual || !csvNaturezaPCASP || !csvMatrizSaldos) {
      return res.status(400).json({ error: 'Faltam arquivos CSV no corpo da requisição' });
    }

    // --- Consolidador de saldos ---
    const saldosMesAnterior = processarMatrizSaldosConsolidacao(csvMesAnterior);
    const saldosMesAtual = processarMatrizSaldosConsolidacao(csvMesAtual);
    const divergenciasSaldos = identificarDivergenciasSaldos(saldosMesAnterior, saldosMesAtual);
    const csvDivergenciasSaldos = gerarCSVDivergenciasSaldos(divergenciasSaldos);

    // --- Verificação de naturezas ---
    const matrizSaldos = processarMatrizSaldos(csvMatrizSaldos);
    const naturezasPCAP = processarNaturezasPCAP(csvNaturezaPCASP);
    const divergenciasNatureza = identificarDivergencias(matrizSaldos, naturezasPCAP);
    const csvDivergenciasNatureza = gerarCSVDivergencias(divergenciasNatureza);

    // Retorna JSON com ambos os resultados e CSVs
    return res.status(200).json({
      divergenciasSaldos,
      csvDivergenciasSaldos,
      divergenciasNatureza,
      csvDivergenciasNatureza
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
