import { PartialType } from '@nestjs/swagger';
import { CreateTituloPanelDto } from './create-titulo-panel.dto';

export class UpdateTituloPanelDto extends PartialType(CreateTituloPanelDto) {}
