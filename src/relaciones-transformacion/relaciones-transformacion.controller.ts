import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelacionesTransformacionService } from './relaciones-transformacion.service';
import { CreateRelacionTransformacionDto } from './dto/create-relaciones-transformacion.dto';
import { UpdateRelacionTransformacionDto } from './dto/update-relaciones-transformacion.dto';

@Controller('relacion-transformacion')
export class RelacionesTransformacionController {
  constructor(private readonly relacionTransformacionService: RelacionesTransformacionService) {}

  @Post()
  create(@Body() createRelacionTransformacionDto: CreateRelacionTransformacionDto) {
    return this.create(createRelacionTransformacionDto);
  }

  @Get()
  findAll() {
    return this.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRelacionTransformacionDto: UpdateRelacionTransformacionDto) {
    return this.update(+id, updateRelacionTransformacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.remove(+id);
  }
}
