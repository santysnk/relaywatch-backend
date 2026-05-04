import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LecturasService } from './lecturas.service';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';

@Controller('lecturas')
export class LecturasController {
  constructor(private readonly lecturasService: LecturasService) {}

  @Post()
  create(@Body() createLecturaDto: CreateLecturaDto) {
    return this.lecturasService.create(createLecturaDto);
  }

  @Get()
  findAll() {
    return this.lecturasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lecturasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLecturaDto: UpdateLecturaDto) {
    return this.lecturasService.update(+id, updateLecturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lecturasService.remove(+id);
  }
}
