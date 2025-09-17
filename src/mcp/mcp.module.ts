// MCP Module - Módulo principal do MCP
import { Module } from '@nestjs/common';
import { McpController } from '@/infrastructure/controllers/mcp.controller';
import { McpUseCase } from '@/application/use-cases/mcp.use-case';
import { McpRepository } from '@/infrastructure/repositories/mcp.repository';
import { IMcpRepository, MCP_REPOSITORY_TOKEN } from '@/domain/interfaces/mcp.interfaces';

@Module({
  controllers: [McpController],
  providers: [
    McpUseCase,
    {
      provide: MCP_REPOSITORY_TOKEN,
      useClass: McpRepository,
    },
  ],
  exports: [McpUseCase, MCP_REPOSITORY_TOKEN],
})
export class McpModule {}
