import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lectura } from './entities/lectura.entity';  
import { LecturasService } from './lecturas.service';
import { LecturasController } from './lecturas.controller';
import { SimuladorService } from './simulador.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lectura])],
  controllers: [LecturasController],
  providers: [LecturasService, SimuladorService],
})
export class LecturasModule {}
