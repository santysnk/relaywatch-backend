import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelacionesTransformacionService } from './relaciones-transformacion.service';
import { CreateRelacionesTransformacionDto } from './dto/create-relaciones-transformacion.dto';
import { UpdateRelacionesTransformacionDto } from './dto/update-relaciones-transformacion.dto';

@Controller('relaciones-transformacion')
export class RelacionesTransformacionController {
  constructor(private readonly relacionesTransformacionService: RelacionesTransformacionService) {}

  @Post()
  create(@Body() createRelacionesTransformacionDto: CreateRelacionesTransformacionDto) {
    return this.relacionesTransformacionService.create(createRelacionesTransformacionDto);
  }

  @Get()
  findAll() {
    return this.relacionesTransformacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relacionesTransformacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRelacionesTransformacionDto: UpdateRelacionesTransformacionDto) {
    return this.relacionesTransformacionService.update(+id, updateRelacionesTransformacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relacionesTransformacionService.remove(+id);
  }
}
