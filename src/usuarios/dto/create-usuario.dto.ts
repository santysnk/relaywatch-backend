import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Santiago', description: 'Nombre del usuario', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Casal', description: 'Apellido del usuario', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  apellido: string;

  @ApiProperty({ example: 'santi@test.com', description: 'Email único del usuario' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Contraseña en texto plano (se hashea con bcrypt). Mínimo 8 caracteres.',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
