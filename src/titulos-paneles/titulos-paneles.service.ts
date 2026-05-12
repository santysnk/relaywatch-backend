import { Injectable } from '@nestjs/common';
import { CreateTituloPanelDto } from './dto/create-titulo-panel.dto';
import { UpdateTituloPanelDto } from './dto/update-titulo-panel.dto';

@Injectable()
export class TitulosPanelesService {
  create(createTituloPanelDto: CreateTituloPanelDto) {
    return 'This action adds a new tituloPanel';
  }

  findAll() {
    return `This action returns all titulosPaneles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} titulosPanele`;
  }

  update(id: number, updateTituloPanelDto: UpdateTituloPanelDto) {
    return `This action updates a #${id} tituloPanel`;
  }

  remove(id: number) {
    return `This action removes a #${id} tituloPanel`;
  }
}
