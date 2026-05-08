import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistradorDto } from './create-registradore.dto';

export class UpdateRegistradorDto extends PartialType(CreateRegistradorDto) {}
    

