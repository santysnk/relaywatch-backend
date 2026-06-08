import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Registrador } from './entities/registrador.entity';
import { ConfigRegistrador } from '../config-registrador/entities/config-registrador.entity';
import { CreateRegistradorDto } from './dto/create-registrador.dto';
import { UpdateRegistradorDto } from './dto/update-registrador.dto';

@Injectable()
export class RegistradoresService {
  constructor(
    @InjectRepository(Registrador)
    private readonly registradorRepo: Repository<Registrador>,

    @InjectRepository(ConfigRegistrador)
    private readonly configRepo: Repository<ConfigRegistrador>,
  ) {}

  // Relaciones que cargamos para devolver un registrador "completo"
  // (sus parámetros configurados + relación de transformación + títulos de panel)
  private readonly relations = [
    'configsRegistrador',
    'configsRegistrador.parametro',
    'configsRegistrador.relacionTransformacion',
    'tituloPanelSuperior',
    'tituloPanelInferior',
  ];

  // ─── CREATE ──────────────────────────────────────────────────
  async create(dto: CreateRegistradorDto): Promise<Registrador> {
    // Separamos los configs (otra tabla) del resto de campos del registrador
    const { configs, ...datosRegistrador } = dto;

    // 1. Crear y guardar el registrador (sus campos propios)
    const registrador = this.registradorRepo.create(datosRegistrador);
    const guardado = await this.guardarConManejoDeError(registrador);

    // 2. Si vinieron configs, crearlos apuntando al registrador recién creado
    if (configs && configs.length > 0) {
      const entidadesConfig = this.configRepo.create(
        configs.map((c) => ({
          idRegistrador: guardado.id,
          idParametro: c.idParametro,
          idRelacionTransformacion: c.idRelacionTransformacion ?? null,
          panel: c.panel ?? 'superior',
          orden: c.orden ?? 0,
        })),
      );
      await this.configRepo.save(entidadesConfig);
    }

    // 3. Devolver el registrador completo con sus relaciones
    return this.findOne(guardado.id);
  }

  // ─── FIND ALL ────────────────────────────────────────────────
  findAll(): Promise<Registrador[]> {
    return this.registradorRepo.find({ relations: this.relations });
  }

  // ─── FIND ONE ────────────────────────────────────────────────
  async findOne(id: number): Promise<Registrador> {
    const registrador = await this.registradorRepo.findOne({
      where: { id },
      relations: this.relations,
    });
    if (!registrador) {
      throw new NotFoundException(`Registrador con id ${id} no encontrado`);
    }
    return registrador;
  }

  // ─── UPDATE ──────────────────────────────────────────────────
  async update(id: number, dto: UpdateRegistradorDto): Promise<Registrador> {
    const registrador = await this.findOne(id); // 404 si no existe

    const { configs, ...datosRegistrador } = dto;

    // 1. Actualizar los campos propios del registrador
    Object.assign(registrador, datosRegistrador);
    await this.guardarConManejoDeError(registrador);

    // 2. Si mandaron configs, reemplazamos los anteriores por los nuevos
    //    (borra todos los de este registrador y vuelve a insertar)
    if (configs) {
      await this.configRepo.delete({ idRegistrador: id });
      if (configs.length > 0) {
        const entidadesConfig = this.configRepo.create(
          configs.map((c) => ({
            idRegistrador: id,
            idParametro: c.idParametro,
            idRelacionTransformacion: c.idRelacionTransformacion ?? null,
            panel: c.panel ?? 'superior',
            orden: c.orden ?? 0,
          })),
        );
        await this.configRepo.save(entidadesConfig);
      }
    }

    return this.findOne(id);
  }

  // ─── REMOVE ──────────────────────────────────────────────────
  async remove(id: number): Promise<void> {
    const registrador = await this.findOne(id); // 404 si no existe
    // Los configs y lecturas se borran solos por ON DELETE CASCADE en la DB
    await this.registradorRepo.remove(registrador);
  }

  // ─── HELPER: guardar manejando nombre/ip duplicados ──────────
  private async guardarConManejoDeError(registrador: Registrador): Promise<Registrador> {
    try {
      return await this.registradorRepo.save(registrador);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Ya existe un registrador con ese nombre o IP',
        );
      }
      throw error;
    }
  }
}
