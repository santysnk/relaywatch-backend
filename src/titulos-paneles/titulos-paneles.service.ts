import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { TituloPanel } from './entities/titulo-panel.entity';
import { Registrador } from '../registradores/entities/registrador.entity';
import { CreateTituloPanelDto } from './dto/create-titulo-panel.dto';
import { UpdateTituloPanelDto } from './dto/update-titulo-panel.dto';

@Injectable()
export class TitulosPanelesService {
  // El título con id=1 ("Sin determinar") es el default de los registradores:
  // no se puede eliminar.
  private readonly ID_DEFAULT = 1;

  constructor(
    @InjectRepository(TituloPanel)
    private readonly tituloRepo: Repository<TituloPanel>,

    @InjectRepository(Registrador)
    private readonly registradorRepo: Repository<Registrador>,
  ) {}

  // ─── CREATE ──────────────────────────────────────────────────
  async create(dto: CreateTituloPanelDto): Promise<TituloPanel> {
    const titulo = this.tituloRepo.create(dto);
    try {
      return await this.tituloRepo.save(titulo);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Ya existe un título con ese nombre');
      }
      throw error;
    }
  }

  // ─── FIND ALL ────────────────────────────────────────────────
  findAll(): Promise<TituloPanel[]> {
    return this.tituloRepo.find();
  }

  // ─── FIND ONE ────────────────────────────────────────────────
  async findOne(id: number): Promise<TituloPanel> {
    const titulo = await this.tituloRepo.findOneBy({ id });
    if (!titulo) {
      throw new NotFoundException(`Título de panel con id ${id} no encontrado`);
    }
    return titulo;
  }

  // ─── UPDATE ──────────────────────────────────────────────────
  async update(id: number, dto: UpdateTituloPanelDto): Promise<TituloPanel> {
    // Proteger el título por defecto "Sin determinar" (no se puede renombrar)
    if (id === this.ID_DEFAULT) {
      throw new BadRequestException(
        'No se puede modificar el título por defecto "Sin determinar"',
      );
    }
    const titulo = await this.findOne(id); // 404 si no existe
    Object.assign(titulo, dto);
    try {
      return await this.tituloRepo.save(titulo);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Ya existe un título con ese nombre');
      }
      throw error;
    }
  }

  // ─── REMOVE ──────────────────────────────────────────────────
  async remove(id: number): Promise<void> {
    // Proteger el título por defecto "Sin determinar"
    if (id === this.ID_DEFAULT) {
      throw new BadRequestException(
        'No se puede eliminar el título por defecto "Sin determinar"',
      );
    }
    const titulo = await this.findOne(id); // 404 si no existe

    // Reasignar al título por defecto (id=1) los registradores que usaban
    // este título, tanto en el panel superior como en el inferior. Así no
    // quedan registradores apuntando a un título inexistente y el borrado
    // no es bloqueado por la FK (cada UPDATE afecta a todos de una sola vez).
    await this.registradorRepo.update(
      { idTituloPanelSuperior: id },
      { idTituloPanelSuperior: this.ID_DEFAULT },
    );
	 
    await this.registradorRepo.update(
      { idTituloPanelInferior: id },
      { idTituloPanelInferior: this.ID_DEFAULT },
    );

    // Ahora nadie lo referencia → se puede borrar
    await this.tituloRepo.remove(titulo);
  }
}
