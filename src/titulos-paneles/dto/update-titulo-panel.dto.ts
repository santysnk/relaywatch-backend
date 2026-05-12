import { PartialType } from '@nestjs/mapped-types';
import { CreateTituloPanelDto } from './create-titulo-panel.dto';

export class UpdateTituloPanelDto extends PartialType(CreateTituloPanelDto) {}
