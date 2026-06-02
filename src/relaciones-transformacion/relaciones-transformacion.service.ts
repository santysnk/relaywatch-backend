import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelacionesTransformacion } from './entities/relaciones-transformacion.entity';
import { CreateRelacionTransformacionDto } from './dto/create-relaciones-transformacion.dto';
import { UpdateRelacionTransformacionDto } from './dto/update-relaciones-transformacion.dto';

@Injectable()
export class RelacionesTransformacionService {
  constructor(
    @InjectRepository(RelacionesTransformacion)
    private readonly relacionRepo: Repository<RelacionesTransformacion>,
  ) {}

  // ─── CREATE ──────────────────────────────────────────────────
  create(
    dto: CreateRelacionTransformacionDto,
  ): Promise<RelacionesTransformacion> {
    const relacion = this.relacionRepo.create(dto);
    return this.relacionRepo.save(relacion);
  }

  // ─── FIND ALL ────────────────────────────────────────────────
  findAll(): Promise<RelacionesTransformacion[]> {
    return this.relacionRepo.find();
  }

  // ─── FIND ONE ────────────────────────────────────────────────
  async findOne(id: number): Promise<RelacionesTransformacion> {
    const relacion = await this.relacionRepo.findOneBy({ id });
    if (!relacion) {
      throw new NotFoundException(
        `Relación de transformación con id ${id} no encontrada`,
      );
    }
    return relacion;
  }

  // ─── UPDATE ──────────────────────────────────────────────────
  async update(
    id: number,
    dto: UpdateRelacionTransformacionDto,
  ): Promise<RelacionesTransformacion> {
    const relacion = await this.findOne(id); // 404 si no existe
    Object.assign(relacion, dto);
    return this.relacionRepo.save(relacion);
  }

  // ─── REMOVE ──────────────────────────────────────────────────
  async remove(id: number): Promise<void> {
    const relacion = await this.findOne(id); // 404 si no existe
    // La FK en config_registrador es ON DELETE SET NULL: si algún config la
    // usaba, queda con relación nula (no bloquea el borrado).
    await this.relacionRepo.remove(relacion);
  }
}
