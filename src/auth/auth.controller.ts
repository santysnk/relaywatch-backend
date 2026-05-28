import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // ─── POST /auth/register ────────────────────────────────────
    // Crea un usuario nuevo y devuelve un token para iniciar sesión inmediatamente.
    @Post('register')
    register(@Body() dto: CreateUsuarioDto) {
        return this.authService.register(dto);
    }

    // ─── POST /auth/login ───────────────────────────────────────
    // Valida credenciales y devuelve token + datos del usuario.
    @Post('login')
    @HttpCode(HttpStatus.OK)   // ← 200, no 201 (login no "crea" nada)
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }
}
