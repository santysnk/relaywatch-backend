import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
    ) { }

    // ─── REGISTER ───────────────────────────────────────────────
    // Crea el usuario reutilizando UsuariosService y devuelve un token.
    async register(dto: CreateUsuarioDto) {
        const usuario = await this.usuariosService.create(dto);
        return this.generarRespuesta(usuario);
    }

    // ─── LOGIN ──────────────────────────────────────────────────
    // Valida email + password contra la DB y devuelve un token.
    async login(email: string, password: string) {
        const usuario = await this.usuariosService.findByEmail(email);

        // ¡Importante! Mismo mensaje para "usuario no existe" y "password incorrecto".
        // No le decimos al atacante cuál de las dos falló (seguridad).
        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const passwordValido = await bcrypt.compare(password, usuario.passwordHash);
        if (!passwordValido) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return this.generarRespuesta(usuario);
    }

    // ─── HELPER PRIVADO ─────────────────────────────────────────
    // Genera el JWT + devuelve datos públicos del usuario (sin passwordHash).
    private generarRespuesta(usuario: Usuario) {
        const payload = {
            sub: usuario.id,        // "sub" = subject (convención JWT para id del usuario)
            email: usuario.email,
            rol: usuario.rol,
        };

        return {
            access_token: this.jwtService.sign(payload),
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol,
            },
        };
    }
}