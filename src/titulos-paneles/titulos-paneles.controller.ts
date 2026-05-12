import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TitulosPanelesService } from './titulos-paneles.service';
import { CreateTituloPanelDto } from './dto/create-titulo-panel.dto';
import { UpdateTituloPanelDto } from './dto/update-titulo-panel.dto';

@Controller('titulos-paneles')
export class TitulosPanelesController {
  constructor(private readonly titulosPanelesService: TitulosPanelesService) {}

  @Post()
  create(@Body() createTituloPanelDto: CreateTituloPanelDto) {
    return this.titulosPanelesService.create(createTituloPanelDto);
  }

  @Get()
  findAll() {
    return this.titulosPanelesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.titulosPanelesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTituloPanelDto: UpdateTituloPanelDto) {
    return this.titulosPanelesService.update(+id, updateTituloPanelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.titulosPanelesService.remove(+id);
  }
}
