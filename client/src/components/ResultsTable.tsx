/**
 * ResultsTable Component
 * Design: Minimalismo Corporativo Moderno
 * Função: Exibir tabela de divergências encontradas
 */

import { DivergenciaContabil } from '@/lib/csvProcessor';
import { AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsTableProps {
  divergencias: DivergenciaContabil[];
  onDownload: () => void;
  isLoading?: boolean;
}

export default function ResultsTable({
  divergencias,
  onDownload,
  isLoading = false
}: ResultsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Processando arquivos...</p>
        </div>
      </div>
    );
  }

  if (divergencias.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-foreground">Nenhuma divergência encontrada</p>
            <p className="text-sm text-muted-foreground mt-1">
              Todos os saldos estão de acordo com as naturezas PCASP
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold text-foreground">
            {divergencias.length} divergência{divergencias.length !== 1 ? 's' : ''} encontrada{divergencias.length !== 1 ? 's' : ''}
          </h3>
        </div>
        <Button
          onClick={onDownload}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Baixar CSV
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-3 text-left font-semibold text-foreground">Conta</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Natureza Encontrada</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Natureza Correta</th>
              </tr>
            </thead>
            <tbody>
              {divergencias.map((item, index) => (
                <tr
                  key={`${item.conta}-${index}`}
                  className={`
                    border-b border-border transition-colors duration-150
                    ${index % 2 === 0 ? 'bg-background' : 'bg-secondary/20'}
                    hover:bg-primary/5
                  `}
                >
                  <td className="px-6 py-3 font-mono text-foreground">
                    {item.conta}
                  </td>
                  <td className="px-6 py-3 text-foreground">
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-medium">
                      {item.naturezaEncontrada}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-foreground">
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-medium">
                      {item.naturezaCorreta}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Resumo:</span> {divergencias.length} conta{divergencias.length !== 1 ? 's' : ''} com saldo divergente do esperado. Verifique os valores e corrija conforme necessário.
        </p>
      </div>
    </div>
  );
}
