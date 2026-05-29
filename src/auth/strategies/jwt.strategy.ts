import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // De dónde leer el token: del header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Si el token está vencido, rechazarlo (es lo que querés para producción)
      ignoreExpiration: false,
      // La clave para verificar la firma — la misma que usamos para firmar
      secretOrKey: config.get<string>('JWT_SECRET') as string,
    });
  }

  // Este método corre AUTOMÁTICAMENTE después de que Passport
  // verificó la firma del token. Recibe el payload decodificado.
  // Lo que devuelvas acá queda en req.user en los controllers.
  async validate(payload: { sub: number; email: string; rol: string }) {
    return {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}