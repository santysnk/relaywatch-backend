import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Delete, UseGuards } from '@nestjs/common';
import { RelacionesTransformacionService } from './relaciones-transformacion.service';
import { CreateRelacionTransformacionDto } from './dto/create-relaciones-transformacion.dto';
import { UpdateRelacionTransformacionDto } from './dto/update-relaciones-transformacion.dto';
import { Roles } from '../auth/decorators/roles.decorador';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('relaciones-transformacion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')  
export class RelacionesTransformacionController {
  constructor(private readonly relacionTransformacionService: RelacionesTransformacionService) {}

  @Post()
  create(@Body() createRelacionTransformacionDto: CreateRelacionTransformacionDto) {
    return this.relacionTransformacionService.create(createRelacionTransformacionDto);
  }

  @Get()
  findAll() {
    return this.relacionTransformacionService.findAll();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRelacionTransformacionDto: UpdateRelacionTransformacionDto) {
    return this.relacionTransformacionService.update(id, updateRelacionTransformacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.relacionTransformacionService.remove(id);
  }
}
