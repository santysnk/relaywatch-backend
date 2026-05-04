import { Injectable } from '@nestjs/common';
import { CreateConfigRegistradorDto } from './dto/create-config-registrador.dto';
import { UpdateConfigRegistradorDto } from './dto/update-config-registrador.dto';

@Injectable()
export class ConfigRegistradorService {
  create(createConfigRegistradorDto: CreateConfigRegistradorDto) {
    return 'This action adds a new configRegistrador';
  }

  findAll() {
    return `This action returns all configRegistrador`;
  }

  findOne(id: number) {
    return `This action returns a #${id} configRegistrador`;
  }

  update(id: number, updateConfigRegistradorDto: UpdateConfigRegistradorDto) {
    return `This action updates a #${id} configRegistrador`;
  }

  remove(id: number) {
    return `This action removes a #${id} configRegistrador`;
  }
}
