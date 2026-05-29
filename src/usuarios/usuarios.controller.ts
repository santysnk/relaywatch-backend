import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';      
import { Roles } from '../auth/decorators/roles.decorador';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Solo admin puede ver la lista completa de usuarios
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)   
  @Roles('admin')
  findAll() {
    return this.usuariosService.findAll();
  }

  // Cualquier logueado ve SU propio perfil
  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@Req() req) {
    return this.usuariosService.findOneBy(req.user.id);
  }

  // Cualquier logueado edita SUS propios datos
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@Req() req, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.update(req.user.id, dto);
  }

  // Cualquier logueado borra SU propia cuenta
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  removeMe(@Req() req) {
    return this.usuariosService.remove(req.user.id);
  }
}