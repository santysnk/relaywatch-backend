import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorador';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Leer los roles que pide la ruta (del decorador @Roles)
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. Si la ruta no tiene @Roles → no exige rol → dejar pasar
    if (!rolesRequeridos || rolesRequeridos.length === 0) {
      return true;
    }

    // 3. Agarrar el usuario que el JwtStrategy dejó en req.user
    const { user } = context.switchToHttp().getRequest();

    // 4. ¿El rol del usuario está entre los permitidos?
    if (!user || !rolesRequeridos.includes(user.rol)) {
      throw new ForbiddenException('No tenés permiso para realizar esta acción');
    }

    return true;
  }
}