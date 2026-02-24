/**
 * Tabela de Resultados - Consolidação de Saldos
 * Design: Minimalismo Corporativo Moderno
 * Exibe divergências com chave composta (CONTA + IC1-IC6 + TIPO1-TIPO6)
 */

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DivergenciaSaldo } from '@/lib/consolidadorSaldos';

interface ResultsTableConsolidacaoProps {
  divergencias: DivergenciaSaldo[];
  onDownload: () => void;
  isLoading: boolean;
}

export default function ResultsTableConsolidacao({
  divergencias,
  onDownload,
  isLoading
}: ResultsTableConsolidacaoProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-muted-foreground">Processando arquivos...</span>
        </div>
      </div>
    );
  }

  if (divergencias.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma divergência encontrada!
          </h3>
          <p className="text-sm text-muted-foreground">
            Todos os saldos finais do mês anterior correspondem aos saldos iniciais do mês atual.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between bg-secondary/30">
        <div>
          <h3 className="font-semibold text-foreground">
            Divergências Encontradas
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {divergencias.length} linha{divergencias.length !== 1 ? 's' : ''} com saldo divergente
          </p>
        </div>
        <Button onClick={onDownload} size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Baixar CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border sticky top-0">
            <tr>
              <th className="text-left p-2 font-semibold text-foreground">
                Conta
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                IC1
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                TIPO1
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                IC2
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                TIPO2
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                IC3
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                TIPO3
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                IC4
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                TIPO4
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                IC5
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                TIPO5
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                IC6
              </th>
              <th className="text-left p-2 font-semibold text-foreground">
                TIPO6
              </th>
              <th className="text-right p-2 font-semibold text-foreground">
                Saldo Final (Anterior)
              </th>
              <th className="text-right p-2 font-semibold text-foreground">
                Saldo Inicial (Atual)
              </th>
              <th className="text-right p-2 font-semibold text-foreground">
                Diferença
              </th>
            </tr>
          </thead>
          <tbody>
            {divergencias.map((item, index) => (
              <tr
                key={index}
                className="border-b border-border last:border-b-0 hover:bg-secondary/20 transition-colors"
              >
                <td className="p-2 text-left font-mono text-foreground">
                  {item.conta}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.ic1 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.tipo1 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.ic2 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.tipo2 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.ic3 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.tipo3 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.ic4 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.tipo4 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.ic5 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.tipo5 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.ic6 || '-'}
                </td>
                <td className="p-2 text-left font-mono text-foreground">
                  {item.tipo6 || '-'}
                </td>
                <td className="p-2 text-right font-mono text-foreground">
                  {item.saldoFinalMesAnterior}
                </td>
                <td className="p-2 text-right font-mono text-foreground">
                  {item.saldoInicialMesAtual}
                </td>
                <td className={`p-2 text-right font-mono font-semibold ${
                  item.diferenca > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.diferenca > 0 ? '+' : ''}{item.diferenca.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Footer */}
      <div className="border-t border-border p-3 bg-secondary/20 text-xs text-muted-foreground">
        <p>
          <strong>Nota:</strong> A comparação considera a chave composta única formada por CONTA + IC1-IC6 + TIPO1-TIPO6. 
          Cada combinação é tratada como um registro independente.
        </p>
      </div>
    </div>
  );
}
