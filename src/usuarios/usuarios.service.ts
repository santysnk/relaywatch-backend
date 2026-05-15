import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, QueryFailedError} from "typeorm";
import * as bcrypt from 'bcrypt';
import { Usuario } from "./entities/usuario.entity";
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>
  ) { }

  // ─── CREATE ─────────────────────────────────────────────────────
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // 1. Hashear el password antes de tocarlo
    const passwordHash = await bcrypt.hash(createUsuarioDto.password, 10);

    // 2. Armar la instancia (sin password en texto plano)
    const usuario = await this.usuarioRepo.create({
      nombre: createUsuarioDto.nombre,
      apellido: createUsuarioDto.apellido,
      email: createUsuarioDto.email,
      passwordHash: passwordHash,
    });

    // 3. Guardar y manejar conflictos (email duplicado)
    try {
      return await this.usuarioRepo.save(usuario);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).code === 'ER_DUP_ENTRY') { // Código de error de MySQL para violación de unicidad
        throw new ConflictException('Ya existe un usuario con ese email');
      }
      throw error; // Re-lanzar otros errores
    }
  }

  // ─── FIND ALL ─────────────────────────────────────────────────────
  findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find();
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario with id ${id} not found`);
    }
    return usuario;
  }

  // ─── UPDATE ─────────────────────────────────────────────────────
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    // 1. Verificar que existe (reutilizamos findOne — si no existe, tira 404)
    const usuario = await this.findOne(id);

    // 2. Si vino password nuevo, re-hashearlo
    if(updateUsuarioDto.password) {
      usuario.passwordHash = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    // 3. Mergear el resto de campos (excluyendo password que ya manejamos)
    const { password, ...rest } = updateUsuarioDto;
    Object.assign(usuario, rest);
    
    // 4. Guardar con manejo de conflicto por email    
    try {
      return await this.usuarioRepo.save(usuario);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Ya existe un usuario con ese email');
      }
      throw error;
    }
  }

  // ─── REMOVE ─────────────────────────────────────────────────────
  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepo.remove(usuario);
  }
}
