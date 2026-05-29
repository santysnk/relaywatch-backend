import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lectura } from './entities/lectura.entity';

@Injectable()
export class LecturasService {
  constructor(
    @InjectRepository(Lectura)
    private readonly lecturasRepo: Repository<Lectura>,
  ) {}

  //Crea una o mas lecturas en una sola operacion.
  //Se llama desde el OrquestadorLecturasService cada N Segundos.
  async crearLecturas(
    lecturas: Array<{
      idRegistrador: number;
      idParametro: number;
      valor: number;
    }>,
  ): Promise<Lectura[]> {
    const nuevasLecturas = this.lecturasRepo.create(
      lecturas.map((L) => ({
        idRegistrador: L.idRegistrador,
        idParametro: L.idParametro,
        valor: L.valor.toString(),
      })),
    );
    return this.lecturasRepo.save(nuevasLecturas);
  }

  // Trae la última medición de CADA parámetro de un registrador.
  // (el último "batch" que insertó el orquestador)
  async findUltimasPorRegistrador(idRegistrador: number): Promise<Lectura[]> {
    // 1. Buscar la fila más reciente de ese registrador (para saber el created_at)
    const ultima = await this.lecturasRepo.findOne({
      where: { idRegistrador },
      order: { createdAt: 'DESC' },
    });

    // 2. Si nunca se midió, devolver array vacío
    if (!ultima) {
      return [];
    }

    // 3. Traer TODAS las filas de ese registrador con ese mismo created_at
    //    (las 6 del último batch), con el nombre/unidad del parámetro
    return this.lecturasRepo.find({
      where: { idRegistrador, createdAt: ultima.createdAt },
      relations: ['parametro'],
      order: { idParametro: 'ASC' },
    });
  }
}
