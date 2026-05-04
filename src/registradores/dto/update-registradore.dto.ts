import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistradoreDto } from './create-registradore.dto';

export class UpdateRegistradoreDto extends PartialType(CreateRegistradoreDto) {}
