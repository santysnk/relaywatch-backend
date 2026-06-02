import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@relaywatch.com', description: 'Email del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', description: 'Contraseña del usuario' })
  @IsString()
  password: string;
}
