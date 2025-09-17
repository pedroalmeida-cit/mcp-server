// Infrastructure Layer - Implementações concretas
import { Injectable } from '@nestjs/common';
import { McpRequestEntity, McpResponseEntity } from '@/domain/entities/mcp.entity';
import { IMcpRepository } from '@/domain/interfaces/mcp.interfaces';

@Injectable()
export class McpRepository implements IMcpRepository {
  private requests: Map<string, McpRequestEntity> = new Map();
  private responses: Map<string, McpResponseEntity> = new Map();

  async saveRequest(request: McpRequestEntity): Promise<void> {
    this.requests.set(request.id, request);
  }

  async saveResponse(response: McpResponseEntity): Promise<void> {
    this.responses.set(response.id, response);
  }

  async findRequestById(id: string): Promise<McpRequestEntity | null> {
    return this.requests.get(id) || null;
  }

  async findResponseById(id: string): Promise<McpResponseEntity | null> {
    return this.responses.get(id) || null;
  }

  // Métodos adicionais para debug e monitoramento
  getAllRequests(): McpRequestEntity[] {
    return Array.from(this.requests.values());
  }

  getAllResponses(): McpResponseEntity[] {
    return Array.from(this.responses.values());
  }

  clear(): void {
    this.requests.clear();
    this.responses.clear();
  }
}
