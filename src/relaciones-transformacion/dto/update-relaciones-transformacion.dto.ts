import { PartialType } from '@nestjs/mapped-types';
import { CreateRelacionTransformacionDto } from './create-relaciones-transformacion.dto';

export class UpdateRelacionTransformacionDto extends PartialType(CreateRelacionTransformacionDto) {}
