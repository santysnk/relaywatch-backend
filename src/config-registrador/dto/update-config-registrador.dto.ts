import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigRegistradorDto } from './create-config-registrador.dto';

export class UpdateConfigRegistradorDto extends PartialType(CreateConfigRegistradorDto) {}
