import { Module } from '@nestjs/common';
import { RelacionesTransformacionService } from './relaciones-transformacion.service';
import { RelacionesTransformacionController } from './relaciones-transformacion.controller';

@Module({
  controllers: [RelacionesTransformacionController],
  providers: [RelacionesTransformacionService],
})
export class RelacionesTransformacionModule {}
