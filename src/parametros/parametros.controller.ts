import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Delete, UseGuards } from '@nestjs/common';
import { ParametrosService } from './parametros.service';
import { CreateParametroDto } from './dto/create-parametro.dto';
import { UpdateParametroDto } from './dto/update-parametro.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorador';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('parametros')
@ApiBearerAuth()
@Controller('parametros')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')  
export class ParametrosController {
  constructor(private readonly parametrosService: ParametrosService) {}

  @Post()
  create(@Body() createParametroDto: CreateParametroDto) {
    return this.parametrosService.create(createParametroDto);
  }

  @Get()
  findAll() {
    return this.parametrosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parametrosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateParametroDto: UpdateParametroDto) {
    return this.parametrosService.update(id, updateParametroDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parametrosService.remove(id);
  }
}
