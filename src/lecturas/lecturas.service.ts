import { Injectable } from '@nestjs/common';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';

@Injectable()
export class LecturasService {

  // ─── CREATE ─────────────────────────────────────────────────────
  create(createLecturaDto: CreateLecturaDto) {
    return 'This action adds a new lectura';
  }

  // ─── FIND ALL ─────────────────────────────────────────────────────
  findAll() {
    return `This action returns all lecturas`;
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────

  findOne(id: number) {
    return `This action returns a #${id} lectura`;
  }
  // ─── UPDATE ─────────────────────────────────────────────────────

  update(id: number, updateLecturaDto: UpdateLecturaDto) {
    return `This action updates a #${id} lectura`;
  }

  // ─── REMOVE ─────────────────────────────────────────────────────

  remove(id: number) {
    return `This action removes a #${id} lectura`;
  }
}
