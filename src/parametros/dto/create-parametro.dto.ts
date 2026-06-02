import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, Min } from 'class-validator';

export class CreateParametroDto {
  @ApiProperty({ example: 'Tensión R', description: 'Nombre de la magnitud medida', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  nombre: string;

  @ApiProperty({ example: 'kV', description: 'Unidad de medida (kV, A, kW, Hz...)', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  unidad: string;

  @ApiProperty({
    example: 152,
    description: 'Dirección Modbus (1-based) del registro en el relé REF615',
  })
  @IsInt()
  @Min(0)
  indiceParametro: number;
}
