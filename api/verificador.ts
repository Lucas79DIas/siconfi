// api/verificador.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { 
  processarMatrizSaldosConsolidacao, 
  identificarDivergenciasSaldos, 
  gerarCSVDivergenciasSaldos 
} from './consolidadorSaldos';

import { 
  processarMatrizSaldos, 
  processarNaturezasPCAP, 
  identificarDivergencias, 
  gerarCSVDivergencias 
} from './csvProcessor';

/**
 * Endpoint Serverless para processar arquivos CSV enviados pelo frontend
 * Retorna divergências de saldos e naturezas contábeis em CSV
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Espera que o frontend envie os arquivos CSV como strings no body
    const { csvMesAnterior, csvMesAtual, csvSiconfi, csvPCASP } = req.body;

    if (!csvMesAnterior || !csvMesAtual || !csvSiconfi || !csvPCASP) {
      return res.status(400).json({ error: 'É necessário enviar todos os arquivos CSV: csvMesAnterior, csvMesAtual, csvSiconfi, csvPCASP' });
    }

    // 1️⃣ Processar Consolidador de Saldos
    const saldosMesAnterior = processarMatrizSaldosConsolidacao(csvMesAnterior);
    const saldosMesAtual = processarMatrizSaldosConsolidacao(csvMesAtual);
    const divergenciasSaldos = identificarDivergenciasSaldos(saldosMesAnterior, saldosMesAtual);
    const csvDivergenciasSaldos = gerarCSVDivergenciasSaldos(divergenciasSaldos);

    // 2️⃣ Processar Verificador de Naturezas
    const matrizSaldos = processarMatrizSaldos(csvSiconfi);
    const naturezasPCAP = processarNaturezasPCAP(csvPCASP);
    const divergenciasNatureza = identificarDivergencias(matrizSaldos, naturezasPCAP);
    const csvDivergenciasNatureza = gerarCSVDivergencias(divergenciasNatureza);

    // 3️⃣ Retornar resultado
    return res.status(200).json({
      divergenciasSaldos: csvDivergenciasSaldos,
      divergenciasNatureza: csvDivergenciasNatureza
    });
    
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Erro interno no servidor' });
  }
}
