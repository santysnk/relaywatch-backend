import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registrador } from './entities/registradore.entity';
import { RegistradoresService } from './registradores.service';
import { RegistradoresController } from './registradores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Registrador])],
  controllers: [RegistradoresController],
  providers: [RegistradoresService],
})
export class RegistradoresModule {}
