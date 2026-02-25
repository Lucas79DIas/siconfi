import React, { useState } from 'react';

export default function App() {
  const [csvMesAnterior, setCsvMesAnterior] = useState<File | null>(null);
  const [csvMesAtual, setCsvMesAtual] = useState<File | null>(null);
  const [csvMatrizSaldos, setCsvMatrizSaldos] = useState<File | null>(null);
  const [csvNaturezaPCASP, setCsvNaturezaPCASP] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!csvMesAnterior || !csvMesAtual || !csvMatrizSaldos || !csvNaturezaPCASP) {
      alert('Selecione todos os arquivos CSV!');
      return;
    }

    setLoading(true);

    try {
      // Ler os arquivos como texto
      const readFileAsText = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(file, 'UTF-8');
        });

      const [mesAnteriorText, mesAtualText, matrizText, pcaspText] = await Promise.all([
        readFileAsText(csvMesAnterior),
        readFileAsText(csvMesAtual),
        readFileAsText(csvMatrizSaldos),
        readFileAsText(csvNaturezaPCASP)
      ]);

      // Enviar para API
      const res = await fetch('/api/verificador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvMesAnterior: mesAnteriorText,
          csvMesAtual: mesAtualText,
          csvMatrizSaldos: matrizText,
          csvNaturezaPCASP: pcaspText
        })
      });

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      alert('Erro ao processar os arquivos.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (csv: string, nome: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', nome);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>Consolidador de Saldos & Verificação de Naturezas</h1>

      <label>
        CSV Mês Anterior:
        <input type="file" accept=".csv" onChange={e => setCsvMesAnterior(e.target.files?.[0] || null)} />
      </label>
      <br />
      <label>
        CSV Mês Atual:
        <input type="file" accept=".csv" onChange={e => setCsvMesAtual(e.target.files?.[0] || null)} />
      </label>
      <br />
      <label>
        CSV Matriz Saldos:
        <input type="file" accept=".csv" onChange={e => setCsvMatrizSaldos(e.target.files?.[0] || null)} />
      </label>
      <br />
      <label>
        CSV Natureza PCASP:
        <input type="file" accept=".csv" onChange={e => setCsvNaturezaPCASP(e.target.files?.[0] || null)} />
      </label>
      <br />
      <button onClick={handleUpload} disabled={loading} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        {loading ? 'Processando...' : 'Verificar'}
      </button>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Divergências de Saldos</h2>
          <button onClick={() => downloadCSV(result.csvDivergenciasSaldos, 'divergencias_saldos.csv')}>
            Baixar CSV
          </button>

          <h2>Divergências de Naturezas</h2>
          <button onClick={() => downloadCSV(result.csvDivergenciasNatureza, 'divergencias_naturezas.csv')}>
            Baixar CSV
          </button>
        </div>
      )}
    </div>
  );
}
