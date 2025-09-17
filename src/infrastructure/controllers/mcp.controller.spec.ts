import { Test, TestingModule } from '@nestjs/testing';
import { McpController } from '@/infrastructure/controllers/mcp.controller';
import { McpUseCase } from '@/application/use-cases/mcp.use-case';
import { McpRepository } from '@/infrastructure/repositories/mcp.repository';
import { IMcpRepository, MCP_REPOSITORY_TOKEN } from '@/domain/interfaces/mcp.interfaces';
import { McpMethod } from '@/domain/entities/mcp.types';

describe('McpController', () => {
  let controller: McpController;
  let useCase: McpUseCase;
  let repository: IMcpRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McpController],
      providers: [
        McpUseCase,
        {
          provide: MCP_REPOSITORY_TOKEN,
          useClass: McpRepository,
        },
      ],
    }).compile();

    controller = module.get<McpController>(McpController);
    useCase = module.get<McpUseCase>(McpUseCase);
    repository = module.get<IMcpRepository>(MCP_REPOSITORY_TOKEN);
  });

  describe('processRequest', () => {
    it('deve processar requisição de inicialização com sucesso', async () => {
      const requestDto = {
        id: '1',
        method: McpMethod.INITIALIZE,
        params: {},
      };

      const result = await controller.processRequest(requestDto);

      expect(result.id).toBe('1');
      expect(result.result).toBeDefined();
      expect(result.result.protocolVersion).toBe('2024-11-05');
      expect(result.result.serverInfo.name).toBe('mcp-server');
      expect(result.error).toBeUndefined();
    });

    it('deve processar requisição de listagem de ferramentas com sucesso', async () => {
      const requestDto = {
        id: '2',
        method: McpMethod.TOOLS_LIST,
        params: {},
      };

      const result = await controller.processRequest(requestDto);

      expect(result.id).toBe('2');
      expect(result.result).toBeDefined();
      expect(result.result.tools).toBeDefined();
      expect(result.result.tools).toHaveLength(1);
      expect(result.result.tools[0].name).toBe('echo');
      expect(result.error).toBeUndefined();
    });

    it('deve processar chamada de ferramenta echo com sucesso', async () => {
      const requestDto = {
        id: '3',
        method: McpMethod.TOOLS_CALL,
        params: {
          name: 'echo',
          arguments: {
            message: 'Hello MCP Server!',
          },
        },
      };

      const result = await controller.processRequest(requestDto);

      expect(result.id).toBe('3');
      expect(result.result).toBeDefined();
      expect(result.result.content).toBeDefined();
      expect(result.result.content[0].text).toBe('Echo: Hello MCP Server!');
      expect(result.error).toBeUndefined();
    });

    it('deve retornar erro para método não encontrado', async () => {
      const requestDto = {
        id: '4',
        method: 'invalid/method',
        params: {},
      };

      const result = await controller.processRequest(requestDto);

      expect(result.id).toBe('4');
      expect(result.result).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe(-32601); // METHOD_NOT_FOUND
      expect(result.error.message).toContain('não encontrado');
    });

    it('deve retornar erro para ferramenta não encontrada', async () => {
      const requestDto = {
        id: '5',
        method: McpMethod.TOOLS_CALL,
        params: {
          name: 'nonexistent',
          arguments: {},
        },
      };

      const result = await controller.processRequest(requestDto);

      expect(result.id).toBe('5');
      expect(result.result).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe(-32601); // METHOD_NOT_FOUND
      expect(result.error.message).toContain('Tool \'nonexistent\' não encontrado');
    });
  });

  describe('getHealth', () => {
    it('deve retornar status de saúde do serviço', async () => {
      const result = await controller.getHealth();

      expect(result.status).toBe('ok');
      expect(result.service).toBe('mcp');
      expect(result.timestamp).toBeDefined();
    });
  });
});

describe('McpUseCase', () => {
  let useCase: McpUseCase;
  let repository: IMcpRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        McpUseCase,
        {
          provide: MCP_REPOSITORY_TOKEN,
          useClass: McpRepository,
        },
      ],
    }).compile();

    useCase = module.get<McpUseCase>(McpUseCase);
    repository = module.get<IMcpRepository>(MCP_REPOSITORY_TOKEN);
  });

  describe('execute', () => {
    it('deve salvar requisição e resposta no repositório', async () => {
      const request = {
        id: 'test-1',
        method: McpMethod.INITIALIZE,
        params: {},
        timestamp: new Date(),
      };

      const response = await useCase.execute(request as any);

      expect(response.id).toBe('test-1');
      expect(response.result).toBeDefined();
      
      // Verificar se foi salvo no repositório
      const savedRequest = await repository.findRequestById('test-1');
      const savedResponse = await repository.findResponseById('test-1');
      
      expect(savedRequest).toBeDefined();
      expect(savedResponse).toBeDefined();
    });
  });
});

describe('McpRepository', () => {
  let repository: McpRepository;

  beforeEach(() => {
    repository = new McpRepository();
  });

  describe('saveRequest e findRequestById', () => {
    it('deve salvar e recuperar requisição', async () => {
      const request = {
        id: 'test-request',
        method: McpMethod.INITIALIZE,
        params: {},
        timestamp: new Date(),
      };

      await repository.saveRequest(request as any);
      const retrieved = await repository.findRequestById('test-request');

      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe('test-request');
      expect(retrieved.method).toBe(McpMethod.INITIALIZE);
    });
  });

  describe('saveResponse e findResponseById', () => {
    it('deve salvar e recuperar resposta', async () => {
      const response = {
        id: 'test-response',
        result: { test: 'data' },
        timestamp: new Date(),
      };

      await repository.saveResponse(response as any);
      const retrieved = await repository.findResponseById('test-response');

      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe('test-response');
      expect(retrieved.result).toEqual({ test: 'data' });
    });
  });

  describe('getAllRequests e getAllResponses', () => {
    it('deve retornar todas as requisições e respostas', async () => {
      const request1 = { id: 'req1', method: 'test1', timestamp: new Date() };
      const request2 = { id: 'req2', method: 'test2', timestamp: new Date() };
      const response1 = { id: 'res1', result: 'data1', timestamp: new Date() };
      const response2 = { id: 'res2', result: 'data2', timestamp: new Date() };

      await repository.saveRequest(request1 as any);
      await repository.saveRequest(request2 as any);
      await repository.saveResponse(response1 as any);
      await repository.saveResponse(response2 as any);

      const allRequests = repository.getAllRequests();
      const allResponses = repository.getAllResponses();

      expect(allRequests).toHaveLength(2);
      expect(allResponses).toHaveLength(2);
    });
  });

  describe('clear', () => {
    it('deve limpar todas as requisições e respostas', async () => {
      const request = { id: 'test', method: 'test', timestamp: new Date() };
      const response = { id: 'test', result: 'data', timestamp: new Date() };

      await repository.saveRequest(request as any);
      await repository.saveResponse(response as any);

      expect(repository.getAllRequests()).toHaveLength(1);
      expect(repository.getAllResponses()).toHaveLength(1);

      repository.clear();

      expect(repository.getAllRequests()).toHaveLength(0);
      expect(repository.getAllResponses()).toHaveLength(0);
    });
  });
});
