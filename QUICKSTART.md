# 🚀 Execução Rápida do MCP Server

## ⚡ Comandos Essenciais

### 1. Verificar Pré-requisitos
```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Instalar pnpm (opcional)
npm install -g pnpm
```

### 2. Instalar Dependências
```bash
# Com npm (funciona sempre)
npm install

# Com pnpm (mais rápido)
pnpm install
```

### 3. Executar o Servidor
```bash
# Desenvolvimento
npm run start:dev
# ou
pnpm run start:dev

# Produção
npm run build
npm run start:prod
```

### 4. Testar o Servidor
```bash
# Teste automático
node test-server.js

# Teste manual
curl http://localhost:3000/health
```

## 🔧 Solução Rápida de Problemas

### Problema: "node não é reconhecido"
**Solução**: Instalar Node.js
- Download: https://nodejs.org/
- Escolher versão LTS (recomendada)
- Reiniciar terminal após instalação

### Problema: "pnpm não é reconhecido"
**Solução**: Usar npm ou instalar pnpm
```bash
# Usar npm
npm install
npm run start:dev

# Ou instalar pnpm
npm install -g pnpm
pnpm install
pnpm run start:dev
```

### Problema: Erro de dependências
**Solução**: Limpar e reinstalar
```bash
# Deletar node_modules
rm -rf node_modules
rm package-lock.json

# Reinstalar
npm install
```

### Problema: Porta em uso
**Solução**: Mudar porta
```bash
# Criar arquivo .env
echo "PORT=3001" > .env

# Ou usar variável de ambiente
PORT=3001 npm run start:dev
```

## 📊 Verificação de Sucesso

Após executar `npm run start:dev`, você deve ver:

```
🚀 Servidor MCP rodando na porta 3000
📚 Documentação disponível em http://localhost:3000/api
```

### Teste Rápido
```bash
# Health check
curl http://localhost:3000/health

# Teste MCP
curl -X POST http://localhost:3000/mcp/request \
  -H "Content-Type: application/json" \
  -d '{"id": "1", "method": "initialize", "params": {}}'
```

## 🎯 Próximos Passos

1. **Instalar Node.js** se necessário
2. **Executar** `npm install`
3. **Iniciar** `npm run start:dev`
4. **Testar** com `node test-server.js`
5. **Acessar** http://localhost:3000/api para documentação
