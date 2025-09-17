import { McpRequestEntity, McpResponseEntity } from '../entities/mcp.entity';

// Repository Pattern - Interface para abstração da camada de dados
export interface IMcpRepository {
  saveRequest(request: McpRequestEntity): Promise<void>;
  saveResponse(response: McpResponseEntity): Promise<void>;
  findRequestById(id: string): Promise<McpRequestEntity | null>;
  findResponseById(id: string): Promise<McpResponseEntity | null>;
}

// Service Pattern - Interface para serviços de domínio
export interface IMcpService {
  processRequest(request: McpRequestEntity): Promise<McpResponseEntity>;
  validateRequest(request: McpRequestEntity): boolean;
}

// Use Case Pattern - Interface para casos de uso
export interface IMcpUseCase {
  execute(request: McpRequestEntity): Promise<McpResponseEntity>;
}

// Token para injeção de dependência
export const MCP_REPOSITORY_TOKEN = Symbol('IMcpRepository');
