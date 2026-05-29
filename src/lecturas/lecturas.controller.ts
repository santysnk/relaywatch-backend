import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LecturasService } from './lecturas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('lecturas')
@UseGuards(JwtAuthGuard) 
export class LecturasController {
  constructor(private readonly lecturasService: LecturasService) { }

   // GET /lecturas/registrador/x/ultimas
  @Get('registrador/:id/ultimas')
  findUltimas(@Param('id', ParseIntPipe) id: number) {
    return this.lecturasService.findUltimasPorRegistrador(id);
  }

  // NO se exponen POST/PATCH/DELETE: las lecturas las crea
  // únicamente el OrquestadorLecturasService.

}
