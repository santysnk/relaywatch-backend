import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigRegistradorService } from './config-registrador.service';
import { CreateConfigRegistradorDto } from './dto/create-config-registrador.dto';
import { UpdateConfigRegistradorDto } from './dto/update-config-registrador.dto';

@Controller('config-registrador')
export class ConfigRegistradorController {
  constructor(private readonly configRegistradorService: ConfigRegistradorService) {}

  @Post()
  create(@Body() createConfigRegistradorDto: CreateConfigRegistradorDto) {
    return this.configRegistradorService.create(createConfigRegistradorDto);
  }

  @Get()
  findAll() {
    return this.configRegistradorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configRegistradorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigRegistradorDto: UpdateConfigRegistradorDto) {
    return this.configRegistradorService.update(+id, updateConfigRegistradorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configRegistradorService.remove(+id);
  }
}
