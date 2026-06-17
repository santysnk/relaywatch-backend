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
  // Tomamos la lectura más reciente POR parámetro (en vez de filtrar por un
  // created_at exacto). Así, aunque un batch se haya guardado "partido" entre
  // dos segundos —algo común cuando la base está en la nube y la inserción es
  // más lenta—, ningún parámetro queda sin valor (no más cajas en "--,--").
  async findUltimasPorRegistrador(idRegistrador: number): Promise<Lectura[]> {
    // Traemos las lecturas más recientes del registrador (varios ciclos) y nos
    // quedamos con la primera —la más nueva— de cada parámetro.
    const recientes = await this.lecturasRepo.find({
      where: { idRegistrador },
      relations: ['parametro'],
      order: { createdAt: 'DESC', id: 'DESC' },
      take: 100, // con ~6 parámetros por registrador, cubre muchos ciclos
    });

    const ultimaPorParametro = new Map<number, Lectura>();
    for (const lectura of recientes) {
      if (!ultimaPorParametro.has(lectura.idParametro)) {
        ultimaPorParametro.set(lectura.idParametro, lectura);
      }
    }

    return [...ultimaPorParametro.values()].sort(
      (a, b) => a.idParametro - b.idParametro,
    );
  }
}
