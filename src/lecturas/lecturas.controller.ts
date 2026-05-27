import { Controller, Get } from '@nestjs/common';
import { LecturasService } from './lecturas.service';


@Controller('lecturas')
export class LecturasController {
  constructor(private readonly lecturasService: LecturasService) { }
  // Endpoints públicos pendientes:
  //   GET /lecturas/registrador/:id/ultimas    (ver Trello)
  //   GET /lecturas/registrador/:id/rango      (ver Trello)
  //
  // NO se exponen POST/PATCH/DELETE: las lecturas las crea
  // únicamente el OrquestadorLecturasService.

}
