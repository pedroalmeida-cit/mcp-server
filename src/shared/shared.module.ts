// Shared Layer - Utilitários e configurações compartilhadas
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  exports: [ConfigModule],
})
export class SharedModule {}
