#!/usr/bin/env node

/**
 * Script simples para testar o MCP Server
 * Execute: node test-server.js
 */

const http = require('http');

// Configurações
const HOST = 'localhost';
const PORT = 3000;

// Função para fazer requisições HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, body: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Testes
async function runTests() {
  console.log('🧪 Iniciando testes do MCP Server...\n');

  try {
    // Teste 1: Health Check
    console.log('1️⃣ Testando Health Check...');
    const healthResponse = await makeRequest('GET', '/health');
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Resposta:`, healthResponse.body);
    console.log('   ✅ Health Check OK\n');

    // Teste 2: Inicialização MCP
    console.log('2️⃣ Testando Inicialização MCP...');
    const initResponse = await makeRequest('POST', '/mcp/request', {
      id: '1',
      method: 'initialize',
      params: {},
    });
    console.log(`   Status: ${initResponse.status}`);
    console.log(`   Resposta:`, JSON.stringify(initResponse.body, null, 2));
    console.log('   ✅ Inicialização OK\n');

    // Teste 3: Listar Ferramentas
    console.log('3️⃣ Testando Listagem de Ferramentas...');
    const toolsResponse = await makeRequest('POST', '/mcp/request', {
      id: '2',
      method: 'tools/list',
      params: {},
    });
    console.log(`   Status: ${toolsResponse.status}`);
    console.log(`   Resposta:`, JSON.stringify(toolsResponse.body, null, 2));
    console.log('   ✅ Listagem de Ferramentas OK\n');

    // Teste 4: Executar Echo Tool
    console.log('4️⃣ Testando Execução da Ferramenta Echo...');
    const echoResponse = await makeRequest('POST', '/mcp/request', {
      id: '3',
      method: 'tools/call',
      params: {
        name: 'echo',
        arguments: {
          message: 'Hello MCP Server! 🚀',
        },
      },
    });
    console.log(`   Status: ${echoResponse.status}`);
    console.log(`   Resposta:`, JSON.stringify(echoResponse.body, null, 2));
    console.log('   ✅ Execução da Ferramenta OK\n');

    // Teste 5: Listar Recursos
    console.log('5️⃣ Testando Listagem de Recursos...');
    const resourcesResponse = await makeRequest('POST', '/mcp/request', {
      id: '4',
      method: 'resources/list',
      params: {},
    });
    console.log(`   Status: ${resourcesResponse.status}`);
    console.log(`   Resposta:`, JSON.stringify(resourcesResponse.body, null, 2));
    console.log('   ✅ Listagem de Recursos OK\n');

    console.log('🎉 Todos os testes passaram com sucesso!');
    console.log('\n📚 Documentação disponível em: http://localhost:3000/api');
    console.log('🔍 Health Check: http://localhost:3000/health');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    console.log('\n💡 Verifique se:');
    console.log('   - O servidor está rodando (pnpm run start:dev)');
    console.log('   - A porta 3000 está disponível');
    console.log('   - Não há erros no console do servidor');
  }
}

// Verificar se o servidor está rodando
async function checkServer() {
  try {
    await makeRequest('GET', '/');
    return true;
  } catch (error) {
    return false;
  }
}

// Executar testes
async function main() {
  console.log('🔍 Verificando se o servidor está rodando...');
  
  const isRunning = await checkServer();
  if (!isRunning) {
    console.log('❌ Servidor não está rodando!');
    console.log('\n🚀 Para iniciar o servidor:');
    console.log('   1. Instale as dependências: pnpm install');
    console.log('   2. Inicie o servidor: pnpm run start:dev');
    console.log('   3. Execute este teste novamente: node test-server.js');
    return;
  }

  console.log('✅ Servidor está rodando!\n');
  await runTests();
}

main();
