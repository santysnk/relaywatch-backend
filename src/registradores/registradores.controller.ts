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
import { RegistradoresService } from './registradores.service';
import { CreateRegistradorDto } from './dto/create-registrador.dto';
import { UpdateRegistradorDto } from './dto/update-registrador.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';           
import { Roles } from '../auth/decorators/roles.decorador';   

@ApiTags('registradores')
@ApiBearerAuth()
@Controller('registradores')
@UseGuards(JwtAuthGuard,RolesGuard)
export class RegistradoresController {
  constructor(private readonly registradoresService: RegistradoresService) {}

  @Post()
  @Roles('admin')
  create(@Body() createRegistradorDto: CreateRegistradorDto) {
    return this.registradoresService.create(createRegistradorDto);
  }

  @Get()
  findAll() {
    return this.registradoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registradoresService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRegistradorDto: UpdateRegistradorDto,
  ) {
    return this.registradoresService.update(id, updateRegistradorDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.registradoresService.remove(id);
  }
}
