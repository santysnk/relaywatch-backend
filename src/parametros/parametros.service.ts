import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Parametro } from './entities/parametro.entity';
import { CreateParametroDto } from './dto/create-parametro.dto';
import { UpdateParametroDto } from './dto/update-parametro.dto';

@Injectable()
export class ParametrosService {
  constructor(
    @InjectRepository(Parametro)
    private readonly parametroRepo: Repository<Parametro>,
  ) {}

  // ─── CREATE ──────────────────────────────────────────────────
  async create(dto: CreateParametroDto): Promise<Parametro> {
    const parametro = this.parametroRepo.create(dto);
    try {
      return await this.parametroRepo.save(parametro);
    } catch (error) {
      if (
        error instanceof QueryFailedError && (error as any).code === 'ER_DUP_ENTRY'){
        throw new ConflictException('Ya existe un parámetro con ese nombre e índice',);
      }
      throw error;
    }
  }

  // ─── FIND ALL ────────────────────────────────────────────────
  findAll(): Promise<Parametro[]> {
    return this.parametroRepo.find();
  }

  // ─── FIND ONE ────────────────────────────────────────────────
  async findOne(id: number): Promise<Parametro> {
    const parametro = await this.parametroRepo.findOneBy({ id });
    if (!parametro) {
      throw new NotFoundException(`Parámetro con id ${id} no encontrado`);
    }
    return parametro;
  }

  // ─── UPDATE ──────────────────────────────────────────────────
  async update(id: number, dto: UpdateParametroDto): Promise<Parametro> {
    const parametro = await this.findOne(id); // 404 si no existe
    Object.assign(parametro, dto);
    try {
      return await this.parametroRepo.save(parametro);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException(
          'Ya existe un parámetro con ese nombre e índice',
        );
      }
      throw error;
    }
  }

  // ─── REMOVE ──────────────────────────────────────────────────
  async remove(id: number): Promise<void> {
    const parametro = await this.findOne(id); // 404 si no existe
    try {
      await this.parametroRepo.remove(parametro);
    } catch (error) {
      // FK RESTRICT: el parámetro está usado por algún config o lectura
      if (
        error instanceof QueryFailedError &&
        (error as any).code === 'ER_ROW_IS_REFERENCED_2'
      ) {
        throw new ConflictException(
          'No se puede eliminar: el parámetro está en uso por algún registrador o lectura',
        );
      }
      throw error;
    }
  }
}
