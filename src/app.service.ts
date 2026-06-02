import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Estado básico de la API. Se usa como health-check.
  getEstado() {
    return {
      servicio: 'relaywatch-backend',
      estado: 'ok',
      uptimeSegundos: Math.floor(process.uptime()),
    };
  }
}
