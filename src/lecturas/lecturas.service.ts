import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lectura } from './entities/lectura.entity';



@Injectable()
export class LecturasService {

  constructor(
    @InjectRepository(Lectura)
    private readonly lecturasRepo: Repository<Lectura>
  ) { }

  //Crea una o mas lecturas en una sola operacion.
  //Se llama desde el OrquestadorLecturasService cada N Segundos.
  async crearLecturas(lecturas: Array<{ idRegistrador: number; idParametro: number; valor: number }>): Promise<Lectura[]> {
    const nuevasLecturas = this.lecturasRepo.create(
      lecturas.map(
        (L) => ({
          idRegistrador: L.idRegistrador,
          idParametro: L.idParametro,
          valor: L.valor.toString(),
        })
      )
    )
        return this.lecturasRepo.save(nuevasLecturas);
  }
}
