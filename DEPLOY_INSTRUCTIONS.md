# Instruções de Deploy Permanente em Manus Space

## Resumo

O site foi atualizado com a nova funcionalidade de **Consolidador de Saldos Finais/Iniciais** e está pronto para ser deployado permanentemente.

## URL Atual

**Site Original**: https://verifcontab-ftu5deiq.manus.space/

## Arquivos de Configuração

Os seguintes arquivos foram criados para facilitar o deploy:

1. **Dockerfile** - Configuração Docker para containerização
2. **wasmapp.toml** - Configuração Wasmer para deploy
3. **manus-deploy.json** - Configuração específica para Manus
4. **deploy.sh** - Script de build e deploy
5. **README.md** - Documentação do projeto

## Passos para Deploy

### Opção 1: Deploy via Git (Recomendado)

1. Fazer push do repositório para seu repositório Git:
   ```bash
   git remote add origin <seu-repositorio-git>
   git push -u origin master
   ```

2. Conectar o repositório ao Manus Space:
   - Acessar o painel de controle do Manus Space
   - Selecionar "Novo Projeto"
   - Conectar repositório Git
   - Configurar branch: `master`
   - Build command: `pnpm install && pnpm run build`
   - Start command: `NODE_ENV=production node dist/index.js`
   - Port: `3000`

### Opção 2: Deploy via Docker

1. Build da imagem:
   ```bash
   docker build -t verificador-contabil:latest .
   ```

2. Push para seu registro Docker:
   ```bash
   docker tag verificador-contabil:latest seu-usuario/verificador-contabil:latest
   docker push seu-usuario/verificador-contabil:latest
   ```

3. Configurar no Manus Space para usar a imagem Docker

### Opção 3: Deploy Manual

1. Fazer build local:
   ```bash
   pnpm install
   pnpm run build
   ```

2. Fazer upload dos arquivos em `dist/` para o servidor

3. Iniciar o servidor:
   ```bash
   NODE_ENV=production node dist/index.js
   ```

## Estrutura do Build

O build gera:
- `dist/public/` - Arquivos estáticos (HTML, CSS, JS)
- `dist/index.js` - Servidor Node.js

## Verificação Pós-Deploy

Após o deploy, verificar:

1. ✅ Página inicial carrega em `/`
2. ✅ Página de consolidação carrega em `/consolidacao`
3. ✅ Navegação entre páginas funciona
4. ✅ Upload de arquivos funciona
5. ✅ Processamento de arquivos funciona
6. ✅ Download de CSV funciona

## Variáveis de Ambiente

Configurar no Manus Space:
- `NODE_ENV=production`
- `PORT=3000` (padrão)

## Domínio Permanente

O site estará disponível em:
- **URL Base**: https://verifcontab-ftu5deiq.manus.space/
- **Verificador**: https://verifcontab-ftu5deiq.manus.space/
- **Consolidador**: https://verifcontab-ftu5deiq.manus.space/consolidacao

## Rollback

Se necessário fazer rollback:

1. Revert do commit:
   ```bash
   git revert <commit-hash>
   git push origin master
   ```

2. Ou fazer deploy de uma versão anterior

## Suporte

Para questões sobre o deploy, consulte:
- Documentação do Manus Space
- GitHub Issues do projeto
- Logs de erro do servidor

---

**Projeto**: Verificador de Natureza Contábil com Consolidador de Saldos  
**Versão**: 1.0.0  
**Data**: Janeiro 2026
