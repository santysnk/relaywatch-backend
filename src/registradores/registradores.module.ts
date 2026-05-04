import { Module } from '@nestjs/common';
import { RegistradoresService } from './registradores.service';
import { RegistradoresController } from './registradores.controller';

@Module({
  controllers: [RegistradoresController],
  providers: [RegistradoresService],
})
export class RegistradoresModule {}
