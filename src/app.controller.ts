import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET /  → health-check público (sin token). Verifica que la API esté viva.
  @Get()
  getEstado() {
    return this.appService.getEstado();
  }
}
