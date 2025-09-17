import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MCP Server (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Health Endpoints', () => {
    it('/ (GET) - deve retornar status básico', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('MCP Server está funcionando! 🚀');
    });

    it('/health (GET) - deve retornar informações de saúde', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.timestamp).toBeDefined();
          expect(res.body.uptime).toBeDefined();
          expect(res.body.environment).toBeDefined();
          expect(res.body.version).toBeDefined();
        });
    });

    it('/mcp/health (GET) - deve retornar status do serviço MCP', () => {
      return request(app.getHttpServer())
        .get('/mcp/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.service).toBe('mcp');
          expect(res.body.timestamp).toBeDefined();
        });
    });
  });

  describe('MCP Protocol Endpoints', () => {
    it('/mcp/request (POST) - deve inicializar o protocolo MCP', () => {
      return request(app.getHttpServer())
        .post('/mcp/request')
        .send({
          id: '1',
          method: 'initialize',
          params: {},
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('1');
          expect(res.body.result).toBeDefined();
          expect(res.body.result.protocolVersion).toBe('2024-11-05');
          expect(res.body.result.capabilities).toBeDefined();
          expect(res.body.result.serverInfo).toBeDefined();
          expect(res.body.result.serverInfo.name).toBe('mcp-server');
          expect(res.body.result.serverInfo.version).toBe('1.0.0');
          expect(res.body.error).toBeUndefined();
        });
    });

    it('/mcp/request (POST) - deve listar ferramentas disponíveis', () => {
      return request(app.getHttpServer())
        .post('/mcp/request')
        .send({
          id: '2',
          method: 'tools/list',
          params: {},
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('2');
          expect(res.body.result).toBeDefined();
          expect(res.body.result.tools).toBeDefined();
          expect(res.body.result.tools).toHaveLength(1);
          expect(res.body.result.tools[0].name).toBe('echo');
          expect(res.body.result.tools[0].description).toBe('Echo back the input');
          expect(res.body.result.tools[0].inputSchema).toBeDefined();
          expect(res.body.error).toBeUndefined();
        });
    });

    it('/mcp/request (POST) - deve executar ferramenta echo', () => {
      return request(app.getHttpServer())
        .post('/mcp/request')
        .send({
          id: '3',
          method: 'tools/call',
          params: {
            name: 'echo',
            arguments: {
              message: 'Hello MCP Server!',
            },
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('3');
          expect(res.body.result).toBeDefined();
          expect(res.body.result.content).toBeDefined();
          expect(res.body.result.content).toHaveLength(1);
          expect(res.body.result.content[0].type).toBe('text');
          expect(res.body.result.content[0].text).toBe('Echo: Hello MCP Server!');
          expect(res.body.error).toBeUndefined();
        });
    });

    it('/mcp/request (POST) - deve listar recursos disponíveis', () => {
      return request(app.getHttpServer())
        .post('/mcp/request')
        .send({
          id: '4',
          method: 'resources/list',
          params: {},
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('4');
          expect(res.body.result).toBeDefined();
          expect(res.body.result.resources).toBeDefined();
          expect(res.body.result.resources).toHaveLength(1);
          expect(res.body.result.resources[0].uri).toBe('file://example.txt');
          expect(res.body.result.resources[0].name).toBe('Example File');
          expect(res.body.result.resources[0].description).toBe('An example text file');
          expect(res.body.result.resources[0].mimeType).toBe('text/plain');
          expect(res.body.error).toBeUndefined();
        });
    });

    it('/mcp/request (POST) - deve ler conteúdo de recurso', () => {
      return request(app.getHttpServer())
        .post('/mcp/request')
        .send({
          id: '5',
          method: 'resources/read',
          params: {
            uri: 'file://example.txt',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('5');
          expect(res.body.result).toBeDefined();
          expect(res.body.result.contents).toBeDefined();
          expect(res.body.result.contents).toHaveLength(1);
          expect(res.body.result.contents[0].uri).toBe('file://example.txt');
          expect(res.body.result.contents[0].mimeType).toBe('text/plain');
          expect(res.body.result.contents[0].text).toBeDefined();
          expect(res.body.error).toBeUndefined();
        });
    });
  });

  describe('Error Handling', () => {
    it('/mcp/request (POST) - deve retornar erro para método não encontrado', () => {
      return request(app.getHttpServer())
        .post('/mcp/request')
        .send({
          id: '6',
          method: 'invalid/method',
          params: {},
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('6');
          expect(res.body.result).toBeUndefined();
          expect(res.body.error).toBeDefined();
          expect(res.body.error.code).toBe(-32601); // METHOD_NOT_FOUND
          expect(res.body.error.message).toContain('não encontrado');
        });
    });

    it('/mcp/request (POST) - deve retornar erro para ferramenta não encontrada', () => {
      return request(app.getHttpServer())
        .post('/mcp/request')
        .send({
          id: '7',
          method: 'tools/call',
          params: {
            name: 'nonexistent',
            arguments: {},
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('7');
          expect(res.body.result).toBeUndefined();
          expect(res.body.error).toBeDefined();
          expect(res.body.error.code).toBe(-32601); // METHOD_NOT_FOUND
          expect(res.body.error.message).toContain('Tool \'nonexistent\' não encontrado');
        });
    });

    it('/mcp/request (POST) - deve retornar erro para recurso não encontrado', () => {
      return request(app.getHttpServer())
        .post('/mcp/request')
        .send({
          id: '8',
          method: 'resources/read',
          params: {
            uri: 'file://nonexistent.txt',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('8');
          expect(res.body.result).toBeUndefined();
          expect(res.body.error).toBeDefined();
          expect(res.body.error.code).toBe(-32601); // METHOD_NOT_FOUND
          expect(res.body.error.message).toContain('Resource \'file://nonexistent.txt\' não encontrado');
        });
    });

    it('/mcp/request (POST) - deve retornar erro para requisição inválida', () => {
      return request(app.getHttpServer())
        .post('/mcp/request')
        .send({
          // id ausente
          method: 'initialize',
          params: {},
        })
        .expect(400);
    });
  });

  describe('Concurrent Requests', () => {
    it('deve processar múltiplas requisições simultâneas', async () => {
      const requests = Array.from({ length: 5 }, (_, i) => 
        request(app.getHttpServer())
          .post('/mcp/request')
          .send({
            id: `concurrent-${i}`,
            method: 'initialize',
            params: {},
          })
          .expect(201)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach((response, index) => {
        expect(response.body.id).toBe(`concurrent-${index}`);
        expect(response.body.result).toBeDefined();
        expect(response.body.error).toBeUndefined();
      });
    });
  });
});
