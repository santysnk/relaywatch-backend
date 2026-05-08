import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistradoresService } from './registradores.service';
import { CreateRegistradorDto } from './dto/create-registradore.dto';
import { UpdateRegistradorDto } from './dto/update-registradore.dto';

@Controller('registradores')
export class RegistradoresController {
  constructor(private readonly registradoresService: RegistradoresService) {}

  @Post()
  create(@Body() createRegistradorDto: CreateRegistradorDto) {
    return this.registradoresService.create(createRegistradorDto);
  }

  @Get()
  findAll() {
    return this.registradoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registradoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistradorDto: UpdateRegistradorDto) {
    return this.registradoresService.update(+id, updateRegistradorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registradoresService.remove(+id);
  }
}
