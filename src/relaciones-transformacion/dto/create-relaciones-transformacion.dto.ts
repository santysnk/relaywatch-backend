import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, Matches } from 'class-validator';

export class CreateRelacionTransformacionDto {
  @ApiProperty({
    example: '13800/110',
    description: 'Relación de transformación con formato "primario/secundario" (ej. "13800/110", "100/5")',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  @Matches(/^\d+\/\d+$/, {
    message: 'relacion debe tener formato "entero/entero" (ej. "13800/110" o "100/5")',
  })
  relacion: string;
}
