import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsHexColor,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ConfigRegistradorItemDto {
  @ApiProperty({ example: 1, description: 'ID del parámetro que mide el registrador' })
  @IsInt()
  @Min(1)
  idParametro: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la relación de transformación (TT/TC). Null/omitido si no aplica.',
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  idRelacionTransformacion?: number | null;
}

export class CreateRegistradorDto {
  @ApiProperty({ example: 'REL-01', description: 'Nombre único del registrador', maxLength: 45 })
  @IsString()
  @MaxLength(45)
  nombre: string;

  @ApiProperty({ example: 'rele', enum: ['rele', 'analizador'], description: 'Tipo de equipo' })
  @IsIn(['rele', 'analizador'])
  tipo: 'rele' | 'analizador';

  @ApiPropertyOptional({ example: '#4180ab', description: 'Color del encabezado en formato hex' })
  @IsOptional()
  @IsHexColor()
  headColor?: string;

  @ApiProperty({ example: '192.168.1.10', description: 'IP única del equipo', maxLength: 45 })
  @IsString()
  @MaxLength(45)
  ip: string;

  @ApiProperty({ example: 502, description: 'Puerto Modbus TCP' })
  @IsInt()
  @Min(1)
  puerto: number;

  @ApiProperty({ example: 100, description: 'Registro Modbus inicial del bloque a leer' })
  @IsInt()
  indiceInicial: number;

  @ApiProperty({ example: 100, description: 'Cantidad de registros a leer desde indiceInicial' })
  @IsInt()
  @Min(1)
  cantidadRegistros: number;

  @ApiPropertyOptional({ example: 60, description: 'Período de muestreo en segundos', default: 60 })
  @IsOptional()
  @IsInt()
  @Min(1)
  periodoSegundos?: number;

  @ApiPropertyOptional({ example: true, description: 'Mostrar el panel superior', default: true })
  @IsOptional()
  @IsBoolean()
  panelSuperior?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'ID del título del panel superior', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  idTituloPanelSuperior?: number;

  @ApiPropertyOptional({ example: true, description: 'Mostrar el panel inferior', default: true })
  @IsOptional()
  @IsBoolean()
  panelInferior?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'ID del título del panel inferior', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  idTituloPanelInferior?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Si está activo, el orquestador le genera lecturas',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({
    type: [ConfigRegistradorItemDto],
    description: 'Parámetros que mide el registrador, con su relación de transformación',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfigRegistradorItemDto)
  configs?: ConfigRegistradorItemDto[];
}
