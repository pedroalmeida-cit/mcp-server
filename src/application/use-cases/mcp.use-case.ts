// Application Layer - Casos de uso e serviços de aplicação
import { Injectable, Inject } from '@nestjs/common';
import { McpRequestEntity, McpResponseEntity } from '@/domain/entities/mcp.entity';
import { McpMethod, McpErrorCode } from '@/domain/entities/mcp.types';
import { IMcpUseCase, IMcpRepository, MCP_REPOSITORY_TOKEN } from '@/domain/interfaces/mcp.interfaces';

@Injectable()
export class McpUseCase implements IMcpUseCase {
  constructor(@Inject(MCP_REPOSITORY_TOKEN) private readonly repository: IMcpRepository) {}

  async execute(request: McpRequestEntity): Promise<McpResponseEntity> {
    try {
      // Salvar a requisição
      await this.repository.saveRequest(request);

      // Processar baseado no método
      const response = await this.processMethod(request);

      // Salvar a resposta
      await this.repository.saveResponse(response);

      return response;
    } catch (error) {
      const errorResponse = McpResponseEntity.error(
        request.id,
        McpErrorCode.INTERNAL_ERROR,
        error.message || 'Erro interno do servidor',
      );
      
      await this.repository.saveResponse(errorResponse);
      return errorResponse;
    }
  }

  private async processMethod(request: McpRequestEntity): Promise<McpResponseEntity> {
    switch (request.method) {
      case McpMethod.INITIALIZE:
        return this.handleInitialize(request);
      
      case McpMethod.TOOLS_LIST:
        return this.handleToolsList(request);
      
      case McpMethod.TOOLS_CALL:
        return this.handleToolsCall(request);
      
      case McpMethod.RESOURCES_LIST:
        return this.handleResourcesList(request);
      
      case McpMethod.RESOURCES_READ:
        return this.handleResourcesRead(request);
      
      default:
        return McpResponseEntity.error(
          request.id,
          McpErrorCode.METHOD_NOT_FOUND,
          `Método '${request.method}' não encontrado`,
        );
    }
  }

  private handleInitialize(request: McpRequestEntity): McpResponseEntity {
    return McpResponseEntity.success(request.id, {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
        resources: {},
      },
      serverInfo: {
        name: 'mcp-server',
        version: '1.0.0',
      },
    });
  }

  private handleToolsList(request: McpRequestEntity): McpResponseEntity {
    return McpResponseEntity.success(request.id, {
      tools: [
        {
          name: 'echo',
          description: 'Echo back the input',
          inputSchema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Message to echo back',
              },
            },
            required: ['message'],
          },
        },
      ],
    });
  }

  private handleToolsCall(request: McpRequestEntity): McpResponseEntity {
    const { name, arguments: args } = request.params || {};
    
    if (name === 'echo') {
      return McpResponseEntity.success(request.id, {
        content: [
          {
            type: 'text',
            text: `Echo: ${args?.message || 'No message provided'}`,
          },
        ],
      });
    }

    return McpResponseEntity.error(
      request.id,
      McpErrorCode.METHOD_NOT_FOUND,
      `Tool '${name}' não encontrado`,
    );
  }

  private handleResourcesList(request: McpRequestEntity): McpResponseEntity {
    return McpResponseEntity.success(request.id, {
      resources: [
        {
          uri: 'file://example.txt',
          name: 'Example File',
          description: 'An example text file',
          mimeType: 'text/plain',
        },
      ],
    });
  }

  private handleResourcesRead(request: McpRequestEntity): McpResponseEntity {
    const { uri } = request.params || {};
    
    if (uri === 'file://example.txt') {
      return McpResponseEntity.success(request.id, {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: 'Este é um arquivo de exemplo para demonstração do MCP Server.',
          },
        ],
      });
    }

    return McpResponseEntity.error(
      request.id,
      McpErrorCode.METHOD_NOT_FOUND,
      `Resource '${uri}' não encontrado`,
    );
  }
}
