# Verificador de Natureza Contábil com Consolidador de Saldos

Sistema web para verificação de natureza contábil e consolidação de saldos finais/iniciais entre meses consecutivos.

## 🎯 Funcionalidades

### 1. Verificador de Natureza Contábil
- Compara saldos da matriz contábil com naturezas PCASP
- Identifica contas com natureza incorreta
- Exporta relatório em CSV

### 2. Consolidador de Saldos Finais/Iniciais
- Compara saldos finais do mês anterior com saldos iniciais do mês atual
- Identifica divergências automaticamente
- Detecta contas novas ou desaparecidas
- Exporta relatório em CSV

## 🚀 Deployment

### Pré-requisitos
- Node.js 22+
- pnpm 10+

### Instalação Local

```bash
# Instalar dependências
pnpm install

# Build
pnpm run build

# Iniciar servidor
NODE_ENV=production node dist/index.js
```

O servidor estará disponível em `http://localhost:3000`

### Docker

```bash
# Build da imagem
docker build -t verificador-contabil .

# Executar container
docker run -p 3000:3000 verificador-contabil
```

### Deploy em Manus Space

```bash
# Executar script de deploy
./deploy.sh

# O projeto está pronto para ser deployado em manus.space
```

## 📁 Estrutura do Projeto

```
.
├── client/              # Frontend React
│   ├── src/
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── components/ # Componentes React
│   │   ├── lib/        # Bibliotecas (processadores CSV)
│   │   └── ...
│   └── index.html
├── server/             # Backend Express
│   └── index.ts
├── shared/             # Código compartilhado
├── package.json
├── vite.config.ts
├── tsconfig.json
├── Dockerfile
├── wasmapp.toml        # Configuração Wasmer
└── manus-deploy.json   # Configuração Manus
```

## 🔧 Tecnologias

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Express, Node.js
- **UI**: Shadcn/ui, Lucide React
- **Routing**: Wouter
- **Build**: Vite, esbuild

## 📊 Formatos de Arquivo

### Entrada
- Arquivos CSV com estrutura CSV_siconfi
- Separador: ponto-e-vírgula (;)
- Campos obrigatórios: CONTA, Tipo_valor, Valor

### Saída
- Arquivo CSV com divergências encontradas
- Formato: Conta;Saldo_Anterior;Saldo_Atual;Diferença

## 🌐 URLs

- **Verificador de Natureza**: `/`
- **Consolidador de Saldos**: `/consolidacao`

## 📝 Variáveis de Ambiente

```
NODE_ENV=production
PORT=3000
```

## 🤝 Suporte

Para questões sobre o deployment em Manus Space, consulte a documentação oficial.

## 📄 Licença

MIT

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2026
