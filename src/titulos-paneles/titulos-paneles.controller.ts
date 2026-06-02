import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TitulosPanelesService } from './titulos-paneles.service';
import { CreateTituloPanelDto } from './dto/create-titulo-panel.dto';
import { UpdateTituloPanelDto } from './dto/update-titulo-panel.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorador';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('titulos-paneles')
@ApiBearerAuth()
@Controller('titulos-paneles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')                          
export class TitulosPanelesController {
  constructor(private readonly titulosPanelesService: TitulosPanelesService) {}

  @Post()
  create(@Body() dto: CreateTituloPanelDto) {
    return this.titulosPanelesService.create(dto);
  }

  @Get()
  findAll() {
    return this.titulosPanelesService.findAll();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTituloPanelDto) {
    return this.titulosPanelesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.titulosPanelesService.remove(id);
  }
}