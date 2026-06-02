import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registrador } from './entities/registrador.entity';
import { ConfigRegistrador } from '../config-registrador/entities/config-registrador.entity';
import { RegistradoresService } from './registradores.service';
import { RegistradoresController } from './registradores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Registrador, ConfigRegistrador])],
  controllers: [RegistradoresController],
  providers: [RegistradoresService],
})
export class RegistradoresModule {}
