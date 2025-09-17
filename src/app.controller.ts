import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check do servidor' })
  @ApiResponse({ status: 200, description: 'Servidor funcionando corretamente' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Verificação de saúde da aplicação' })
  @ApiResponse({ status: 200, description: 'Status da aplicação' })
  getHealth() {
    return this.appService.getHealth();
  }
}
