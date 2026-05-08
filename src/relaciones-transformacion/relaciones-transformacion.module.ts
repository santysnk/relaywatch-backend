import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelacionesTransformacion } from './entities/relaciones-transformacion.entity';
import { RelacionesTransformacionService } from './relaciones-transformacion.service';
import { RelacionesTransformacionController } from './relaciones-transformacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RelacionesTransformacion])],
  controllers: [RelacionesTransformacionController],
  providers: [RelacionesTransformacionService],
})
export class RelacionesTransformacionModule {}
