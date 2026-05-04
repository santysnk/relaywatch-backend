import { Injectable } from '@nestjs/common';
import { CreateRelacionesTransformacionDto } from './dto/create-relaciones-transformacion.dto';
import { UpdateRelacionesTransformacionDto } from './dto/update-relaciones-transformacion.dto';

@Injectable()
export class RelacionesTransformacionService {
  create(createRelacionesTransformacionDto: CreateRelacionesTransformacionDto) {
    return 'This action adds a new relacionesTransformacion';
  }

  findAll() {
    return `This action returns all relacionesTransformacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relacionesTransformacion`;
  }

  update(id: number, updateRelacionesTransformacionDto: UpdateRelacionesTransformacionDto) {
    return `This action updates a #${id} relacionesTransformacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} relacionesTransformacion`;
  }
}
