import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lectura } from './entities/lectura.entity';  
import { LecturasService } from './lecturas.service';
import { LecturasController } from './lecturas.controller';
import { SimuladorService } from './simulador.service';
import { Registrador } from '../registradores/entities/registrador.entity';
import { ConfigRegistrador } from '../config-registrador/entities/config-registrador.entity';
import { OrquestadorLecturasService } from './orquestador-lecturas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lectura, Registrador, ConfigRegistrador])],
  controllers: [LecturasController],
  providers: [LecturasService, SimuladorService, OrquestadorLecturasService],
})
export class LecturasModule {}
