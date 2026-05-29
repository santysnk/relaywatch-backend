import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,  
} from '@nestjs/common';
import { RegistradoresService } from './registradores.service';
import { CreateRegistradorDto } from './dto/create-registrador.dto';
import { UpdateRegistradorDto } from './dto/update-registrador.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('registradores')
@UseGuards(JwtAuthGuard)
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
  update(
    @Param('id') id: string,
    @Body() updateRegistradorDto: UpdateRegistradorDto,
  ) {
    return this.registradoresService.update(+id, updateRegistradorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registradoresService.remove(+id);
  }
}
