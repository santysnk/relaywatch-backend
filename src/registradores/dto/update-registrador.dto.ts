import { PartialType } from '@nestjs/swagger';
import { CreateRegistradorDto } from './create-registrador.dto';

export class UpdateRegistradorDto extends PartialType(CreateRegistradorDto) {}
    

