/**
 * Consolidação de Saldos Finais/Iniciais
 * Design: Minimalismo Corporativo Moderno
 * Função: Interface para comparar saldos entre meses consecutivos
 */

import { useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import FileUploadArea from '@/components/FileUploadArea';
import ResultsTableConsolidacao from '@/components/ResultsTableConsolidacao';
import {
  processarMatrizSaldosConsolidacao,
  identificarDivergenciasSaldos,
  gerarCSVDivergenciasSaldos,
  baixarCSV,
  DivergenciaSaldo
} from '@/lib/consolidadorSaldos';

type ProcessingStep = 'idle' | 'loading' | 'success' | 'error';

interface ProcessingState {
  step: ProcessingStep;
  message: string;
  divergencias: DivergenciaSaldo[];
}

export default function Consolidacao() {
  const [mesAnteriorFile, setMesAnteriorFile] = useState<File | null>(null);
  const [mesAtualFile, setMesAtualFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    step: 'idle',
    message: '',
    divergencias: []
  });

  const handleMesAnteriorSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setProcessing({
        step: 'error',
        message: 'Por favor, selecione um arquivo CSV válido para o mês anterior',
        divergencias: []
      });
      return;
    }
    setMesAnteriorFile(file);
    setProcessing({ step: 'idle', message: '', divergencias: [] });
  };

  const handleMesAtualSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setProcessing({
        step: 'error',
        message: 'Por favor, selecione um arquivo CSV válido para o mês atual',
        divergencias: []
      });
      return;
    }
    setMesAtualFile(file);
    setProcessing({ step: 'idle', message: '', divergencias: [] });
  };

  const processarArquivos = async () => {
    if (!mesAnteriorFile || !mesAtualFile) {
      setProcessing({
        step: 'error',
        message: 'Por favor, selecione ambos os arquivos',
        divergencias: []
      });
      return;
    }

    setProcessing({ step: 'loading', message: '', divergencias: [] });

    try {
      // Ler arquivos
      const mesAnteriorContent = await mesAnteriorFile.text();
      const mesAtualContent = await mesAtualFile.text();

      // Processar arquivos
      const saldosMesAnterior = processarMatrizSaldosConsolidacao(mesAnteriorContent);
      const saldosMesAtual = processarMatrizSaldosConsolidacao(mesAtualContent);

      // Identificar divergências
      const divergencias = identificarDivergenciasSaldos(saldosMesAnterior, saldosMesAtual);

      setProcessing({
        step: 'success',
        message: `Processamento concluído: ${divergencias.length} divergência${divergencias.length !== 1 ? 's' : ''} encontrada${divergencias.length !== 1 ? 's' : ''}`,
        divergencias
      });
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao processar arquivos';
      setProcessing({
        step: 'error',
        message: `Erro: ${mensagemErro}`,
        divergencias: []
      });
    }
  };

  const handleDownload = () => {
    if (processing.divergencias.length > 0) {
      const csv = gerarCSVDivergenciasSaldos(processing.divergencias);
      baixarCSV(csv, 'divergencias_saldos.csv');
    }
  };

  const limparFormulario = () => {
    setMesAnteriorFile(null);
    setMesAtualFile(null);
    setProcessing({ step: 'idle', message: '', divergencias: [] });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Consolidador de Saldos Finais/Iniciais
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Compare saldos finais do mês anterior com saldos iniciais do mês atual
                </p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Verificador de Natureza
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Selecione os arquivos
              </h2>

              <div className="space-y-4">
                {/* Mês Anterior Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Matriz do Mês Anterior (CSV_siconfi)
                  </label>
                  <FileUploadArea
                    label="Matriz Mês Anterior"
                    onFileSelect={handleMesAnteriorSelect}
                    disabled={processing.step === 'loading'}
                  />
                  {mesAnteriorFile && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ✓ Arquivo selecionado: {mesAnteriorFile.name}
                    </p>
                  )}
                </div>

                {/* Mês Atual Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Matriz do Mês Atual (CSV_siconfi)
                  </label>
                  <FileUploadArea
                    label="Matriz Mês Atual"
                    onFileSelect={handleMesAtualSelect}
                    disabled={processing.step === 'loading'}
                  />
                  {mesAtualFile && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ✓ Arquivo selecionado: {mesAtualFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={processarArquivos}
                disabled={!mesAnteriorFile || !mesAtualFile || processing.step === 'loading'}
                className="flex-1"
              >
                {processing.step === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  'Processar Arquivos'
                )}
              </Button>

              {(mesAnteriorFile || mesAtualFile) && (
                <Button
                  onClick={limparFormulario}
                  variant="outline"
                  disabled={processing.step === 'loading'}
                >
                  Limpar
                </Button>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Como usar:</span> Selecione o arquivo de matriz do mês anterior e do mês atual. A aplicação compara se o saldo final de cada linha (identificada pela combinação de CONTA + IC1-IC6 + TIPO1-TIPO6) no mês anterior corresponde ao saldo inicial dessa mesma linha no mês atual.
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Resultados
              </h2>

              {/* Status Messages */}
              {processing.step === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900">{processing.message}</p>
                </div>
              )}

              {processing.step === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-900">{processing.message}</p>
                </div>
              )}

              {/* Results Table */}
              {(processing.step === 'loading' || processing.step === 'success') && (
                <ResultsTableConsolidacao
                  divergencias={processing.divergencias}
                  onDownload={handleDownload}
                  isLoading={processing.step === 'loading'}
                />
              )}

              {processing.step === 'idle' && !mesAnteriorFile && !mesAtualFile && (
                <div className="bg-secondary/30 rounded-lg border border-border p-8 text-center">
                  <p className="text-muted-foreground">
                    Selecione os arquivos e clique em "Processar Arquivos" para começar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>Consolidador de Saldos • Processamento seguro no navegador</p>
        </div>
      </footer>
    </div>
  );
}
