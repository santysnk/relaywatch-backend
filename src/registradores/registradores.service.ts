import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, Not, IsNull } from 'typeorm';
import { Registrador } from './entities/registrador.entity';
import { ConfigRegistrador } from '../config-registrador/entities/config-registrador.entity';
import { CreateRegistradorDto, ConfigRegistradorItemDto } from './dto/create-registrador.dto';
import { UpdateRegistradorDto } from './dto/update-registrador.dto';

@Injectable()
export class RegistradoresService {
  // Máximo de parámetros por panel: 3 entran en una fila de la tarjeta
  // sin deformarla. El front impone el mismo límite en el modal de mapeo,
  // pero la regla de verdad vive acá (nunca confiar solo en el cliente).
  private readonly MAX_PARAMETROS_POR_PANEL = 3;

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

  // ─── HELPER: validar el tope de parámetros por panel ─────────
  private validarMaximoPorPanel(configs: ConfigRegistradorItemDto[]): void {
    const cuenta = { superior: 0, inferior: 0 };
    for (const c of configs) {
      cuenta[c.panel ?? 'superior']++;
    }
    if (
      cuenta.superior > this.MAX_PARAMETROS_POR_PANEL ||
      cuenta.inferior > this.MAX_PARAMETROS_POR_PANEL
    ) {
      throw new BadRequestException(
        `Máximo ${this.MAX_PARAMETROS_POR_PANEL} parámetros por panel`,
      );
    }
  }

  // ─── CREATE ──────────────────────────────────────────────────
  async create(dto: CreateRegistradorDto): Promise<Registrador> {
    // Separamos los configs (otra tabla) del resto de campos del registrador
    const { configs, ...datosRegistrador } = dto;
    if (configs) this.validarMaximoPorPanel(configs);

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
    if (configs) this.validarMaximoPorPanel(configs);

    // 1. Actualizar los campos propios del registrador
    Object.assign(registrador, datosRegistrador);

    // El registrador vino con las relaciones de título cargadas (objetos viejos).
    // Al guardar, TypeORM usaría esos objetos para la FK y pisaría el id que
    // acabamos de asignar. Los quitamos para que se respeten
    // idTituloPanelSuperior / idTituloPanelInferior.
    delete (registrador as any).tituloPanelSuperior;
    delete (registrador as any).tituloPanelInferior;

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

  // ─── FIND ELIMINADOS ─────────────────────────────────────────
  // Lista solo los borrados lógicamente. withDeleted desactiva el filtro
  // automático de TypeORM; el where se queda con los que tienen fecha de baja.
  findEliminados(): Promise<Registrador[]> {
    return this.registradorRepo.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
      order: { deletedAt: 'DESC' }, // los borrados más recientes primero
    });
  }

  // ─── RESTAURAR ───────────────────────────────────────────────
  // Espejo del softRemove: vuelve deleted_at a NULL y el registrador
  // reaparece en todos los find() (con su mapeo y lecturas intactos).
  async restaurar(id: number): Promise<Registrador> {
    const resultado = await this.registradorRepo.restore(id);
    if (!resultado.affected) {
      throw new NotFoundException(
        `Registrador con id ${id} no encontrado entre los eliminados`,
      );
    }
    return this.findOne(id);
  }

  // ─── REMOVE (soft delete) ────────────────────────────────────
  async remove(id: number): Promise<void> {
    const registrador = await this.findOne(id); // 404 si no existe
    // Borrado LÓGICO: softRemove setea deleted_at en vez de borrar la fila.
    // La fila sigue en la DB (con su mapeo y todas sus lecturas:
    // pero TypeORM la excluye de todos los find().
    // El ON DELETE CASCADE de la DB nunca se dispara porque no hay DELETE real.
    await this.registradorRepo.softRemove(registrador);
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
