import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TituloPanel } from './entities/titulo-panel.entity';
import { TitulosPanelesService } from './titulos-paneles.service';
import { TitulosPanelesController } from './titulos-paneles.controller';


@Module({
  imports: [TypeOrmModule.forFeature([TituloPanel])],
  controllers: [TitulosPanelesController],
  providers: [TitulosPanelesService],
})
export class TitulosPanelesModule { }
