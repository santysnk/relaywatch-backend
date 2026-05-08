import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lectura } from './entities/lectura.entity';  
import { LecturasService } from './lecturas.service';
import { LecturasController } from './lecturas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lectura])],
  controllers: [LecturasController],
  providers: [LecturasService],
})
export class LecturasModule {}
