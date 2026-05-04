import { Injectable } from '@nestjs/common';
import { CreateRegistradoreDto } from './dto/create-registradore.dto';
import { UpdateRegistradoreDto } from './dto/update-registradore.dto';

@Injectable()
export class RegistradoresService {
  create(createRegistradoreDto: CreateRegistradoreDto) {
    return 'This action adds a new registradore';
  }

  findAll() {
    return `This action returns all registradores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registradore`;
  }

  update(id: number, updateRegistradoreDto: UpdateRegistradoreDto) {
    return `This action updates a #${id} registradore`;
  }

  remove(id: number) {
    return `This action removes a #${id} registradore`;
  }
}
