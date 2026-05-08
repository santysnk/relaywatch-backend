import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigRegistrador } from './entities/config-registrador.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ConfigRegistrador])],
  controllers: [],
  providers: [],
})
export class ConfigRegistradorModule {}
