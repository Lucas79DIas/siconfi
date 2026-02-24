/**
 * Home Page - Verificador de Natureza Contábil
 * Design: Minimalismo Corporativo Moderno
 * Função: Interface principal para upload e processamento de arquivos
 */

import { useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import FileUploadArea from '@/components/FileUploadArea';
import ResultsTable from '@/components/ResultsTable';
import {
  processarMatrizSaldos,
  processarNaturezasPCAP,
  identificarDivergencias,
  gerarCSVDivergencias,
  baixarCSV,
  DivergenciaContabil
} from '@/lib/csvProcessor';

type ProcessingStep = 'idle' | 'loading' | 'success' | 'error';

interface ProcessingState {
  step: ProcessingStep;
  message: string;
  divergencias: DivergenciaContabil[];
}

export default function Home() {
  const [matrizFile, setMatrizFile] = useState<File | null>(null);
  const [pcaspFile, setPcaspFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    step: 'idle',
    message: '',
    divergencias: []
  });

  const handleMatrizSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setProcessing({
        step: 'error',
        message: 'Por favor, selecione um arquivo CSV válido para a matriz',
        divergencias: []
      });
      return;
    }
    setMatrizFile(file);
    setProcessing({ step: 'idle', message: '', divergencias: [] });
  };

  const handlePcaspSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setProcessing({
        step: 'error',
        message: 'Por favor, selecione um arquivo CSV válido para naturezas PCASP',
        divergencias: []
      });
      return;
    }
    setPcaspFile(file);
    setProcessing({ step: 'idle', message: '', divergencias: [] });
  };

  const processarArquivos = async () => {
    if (!matrizFile || !pcaspFile) {
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
      const matrizContent = await matrizFile.text();
      const pcaspContent = await pcaspFile.text();

      // Processar arquivos
      const matrizSaldos = processarMatrizSaldos(matrizContent);
      const naturezasPCAP = processarNaturezasPCAP(pcaspContent);

      // Identificar divergências
      const divergencias = identificarDivergencias(matrizSaldos, naturezasPCAP);

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
      const csv = gerarCSVDivergencias(processing.divergencias);
      baixarCSV(csv, 'contas_com_natureza_errada.csv');
    }
  };

  const limparFormulario = () => {
    setMatrizFile(null);
    setPcaspFile(null);
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
                  Verificador de Natureza Contábil
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Compare saldos da matriz com naturezas PCASP
                </p>
              </div>
            </div>
            <Link href="/consolidacao">
              <Button variant="outline" className="gap-2">
                Consolidador de Saldos
                <ArrowRight className="w-4 h-4" />
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
                {/* Matriz Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Arquivo de Matriz (CSV_siconfi)
                  </label>
                  <FileUploadArea
                    label="Matriz de Saldos"
                    onFileSelect={handleMatrizSelect}
                    disabled={processing.step === 'loading'}
                  />
                  {matrizFile && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ✓ Arquivo selecionado: {matrizFile.name}
                    </p>
                  )}
                </div>

                {/* PCASP Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Arquivo de Naturezas (PCASP)
                  </label>
                  <FileUploadArea
                    label="Naturezas PCASP"
                    onFileSelect={handlePcaspSelect}
                    disabled={processing.step === 'loading'}
                  />
                  {pcaspFile && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ✓ Arquivo selecionado: {pcaspFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={processarArquivos}
                disabled={!matrizFile || !pcaspFile || processing.step === 'loading'}
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

              {(matrizFile || pcaspFile) && (
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
                <span className="font-semibold">Como usar:</span> Selecione o arquivo de matriz contábil (CSV_siconfi) e o arquivo de naturezas PCASP. A aplicação identificará todas as contas com saldos divergentes.
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
              {(processing.step === 'loading' || processing.divergencias.length > 0 || processing.step === 'success') && (
                <ResultsTable
                  divergencias={processing.divergencias}
                  onDownload={handleDownload}
                  isLoading={processing.step === 'loading'}
                />
              )}

              {processing.step === 'idle' && !matrizFile && !pcaspFile && (
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
          <p>Verificador de Natureza Contábil • Processamento seguro no navegador</p>
        </div>
      </footer>
    </div>
  );
}
