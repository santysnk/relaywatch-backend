import { Module } from '@nestjs/common';
import { ConfigRegistradorService } from './config-registrador.service';
import { ConfigRegistradorController } from './config-registrador.controller';

@Module({
  controllers: [ConfigRegistradorController],
  providers: [ConfigRegistradorService],
})
export class ConfigRegistradorModule {}
