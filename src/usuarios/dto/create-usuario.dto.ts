import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";


export class CreateUsuarioDto {

@IsString()
@MaxLength(100)
nombre: string;

@IsString()
@MaxLength(100)
apellido: string;

@IsEmail()
@MaxLength(255)
email: string;

@IsString()
@MinLength(8)
@MaxLength(72)
password: string;

}
