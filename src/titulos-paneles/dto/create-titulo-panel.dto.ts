import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateTituloPanelDto {
  @ApiProperty({
    example: 'Tensión de línea (en 33kV)',
    description: 'Nombre del título de panel',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  nombre: string;
}
