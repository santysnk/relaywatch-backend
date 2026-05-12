import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistradorDto } from './create-registrador.dto';

export class UpdateRegistradorDto extends PartialType(CreateRegistradorDto) {}
    

