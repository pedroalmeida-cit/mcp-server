# 🚀 Guia de Instalação e Execução - MCP Server

## 📋 Pré-requisitos

### 1. Instalar Node.js
- **Versão mínima**: Node.js 18.0.0 ou superior
- **Download**: https://nodejs.org/
- **Verificação**: `node --version`

### 2. Instalar pnpm (Recomendado)
```bash
# Via npm
npm install -g pnpm

# Via PowerShell (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# Verificação
pnpm --version
```

### 3. Alternativa: Usar npm
Se preferir usar npm ao invés de pnpm:
```bash
# Instalar dependências
npm install

# Executar comandos
npm run start:dev
npm run test
```

## 🛠️ Comandos de Execução

### Instalação
```bash
# Com pnpm (recomendado)
pnpm install

# Com npm
npm install
```

### Desenvolvimento
```bash
# Iniciar em modo desenvolvimento
pnpm run start:dev
# ou
npm run start:dev

# Acessar: http://localhost:3000
# Swagger: http://localhost:3000/api
```

### Produção
```bash
# Build
pnpm run build
# ou
npm run build

# Executar produção
pnpm run start:prod
# ou
npm run start:prod
```

### Testes
```bash
# Testes unitários
pnpm run test
# ou
npm run test

# Testes e2e
pnpm run test:e2e
# ou
npm run test:e2e

# Testes com cobertura
pnpm run test:cov
# ou
npm run test:cov
```

## 🧪 Testes Manuais

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Inicialização MCP
```bash
curl -X POST http://localhost:3000/mcp/request \
  -H "Content-Type: application/json" \
  -d '{"id": "1", "method": "initialize", "params": {}}'
```

### 3. Listar Ferramentas
```bash
curl -X POST http://localhost:3000/mcp/request \
  -H "Content-Type: application/json" \
  -d '{"id": "2", "method": "tools/list", "params": {}}'
```

### 4. Executar Echo Tool
```bash
curl -X POST http://localhost:3000/mcp/request \
  -H "Content-Type: application/json" \
  -d '{"id": "3", "method": "tools/call", "params": {"name": "echo", "arguments": {"message": "Hello MCP!"}}}'
```

## 🔧 Solução de Problemas

### Erro: "node não é reconhecido"
- Instale o Node.js: https://nodejs.org/
- Reinicie o terminal após instalação

### Erro: "pnpm não é reconhecido"
- Instale o pnpm: `npm install -g pnpm`
- Ou use npm: `npm install`

### Erro de Porta em Uso
- Mude a porta no arquivo `.env`:
```env
PORT=3001
```

### Erro de Dependências
- Delete `node_modules` e `package-lock.json`
- Execute `pnpm install` novamente

## 📊 Verificação de Funcionamento

Após executar `pnpm run start:dev`, você deve ver:

```
🚀 Servidor MCP rodando na porta 3000
📚 Documentação disponível em http://localhost:3000/api
```

### Endpoints Disponíveis
- `GET /` - Status básico
- `GET /health` - Health check detalhado
- `GET /mcp/health` - Status do serviço MCP
- `POST /mcp/request` - Processar requisição MCP
- `GET /api` - Documentação Swagger

## 🎯 Próximos Passos

1. **Instalar Node.js** se não estiver instalado
2. **Instalar pnpm** (recomendado) ou usar npm
3. **Executar** `pnpm install`
4. **Iniciar** `pnpm run start:dev`
5. **Testar** endpoints com curl ou Swagger UI
6. **Executar testes** `pnpm run test`
