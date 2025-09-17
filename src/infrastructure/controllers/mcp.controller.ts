// Infrastructure Layer - Controllers e DTOs
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { McpUseCase } from '@/application/use-cases/mcp.use-case';
import { McpRequestEntity } from '@/domain/entities/mcp.entity';

class McpRequestDto {
  @IsString()
  id: string;

  @IsString()
  method: string;

  @IsOptional()
  @IsObject()
  params?: Record<string, any>;
}

class McpResponseDto {
  id: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

@ApiTags('mcp')
@Controller('mcp')
export class McpController {
  constructor(private readonly mcpUseCase: McpUseCase) {}

  @Post('request')
  @ApiOperation({ summary: 'Processar requisição MCP' })
  @ApiBody({ type: McpRequestDto })
  @ApiResponse({ status: 200, description: 'Resposta MCP processada', type: McpResponseDto })
  async processRequest(@Body() requestDto: McpRequestDto): Promise<McpResponseDto> {
    const request = McpRequestEntity.create(requestDto);
    const response = await this.mcpUseCase.execute(request);
    
    return {
      id: response.id,
      result: response.result,
      error: response.error,
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Verificar saúde do serviço MCP' })
  @ApiResponse({ status: 200, description: 'Status do serviço MCP' })
  async getHealth() {
    return {
      status: 'ok',
      service: 'mcp',
      timestamp: new Date().toISOString(),
    };
  }
}
