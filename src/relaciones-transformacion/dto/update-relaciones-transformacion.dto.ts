import { PartialType } from '@nestjs/mapped-types';
import { CreateRelacionesTransformacionDto } from './create-relaciones-transformacion.dto';

export class UpdateRelacionesTransformacionDto extends PartialType(CreateRelacionesTransformacionDto) {}
