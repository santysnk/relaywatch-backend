import { Injectable } from '@nestjs/common';
import { CreateRegistradorDto } from './dto/create-registradore.dto';
import { UpdateRegistradorDto } from './dto/update-registradore.dto';

@Injectable()
export class RegistradoresService {
  create(createRegistradorDto: CreateRegistradorDto) {
    return 'This action adds a new registradore';
  }

  findAll() {
    return `This action returns all registradores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registradore`;
  }

  update(id: number, updateRegistradorDto: UpdateRegistradorDto) {
    return `This action updates a #${id} registradore`;
  }

  remove(id: number) {
    return `This action removes a #${id} registradore`;
  }
}
