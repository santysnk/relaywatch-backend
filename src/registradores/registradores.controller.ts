import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistradoresService } from './registradores.service';
import { CreateRegistradoreDto } from './dto/create-registradore.dto';
import { UpdateRegistradoreDto } from './dto/update-registradore.dto';

@Controller('registradores')
export class RegistradoresController {
  constructor(private readonly registradoresService: RegistradoresService) {}

  @Post()
  create(@Body() createRegistradoreDto: CreateRegistradoreDto) {
    return this.registradoresService.create(createRegistradoreDto);
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
  update(@Param('id') id: string, @Body() updateRegistradoreDto: UpdateRegistradoreDto) {
    return this.registradoresService.update(+id, updateRegistradoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registradoresService.remove(+id);
  }
}
