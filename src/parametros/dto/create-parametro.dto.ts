import { IsString, MaxLength } from "class-validator";


export class CreateParametroDto {

    @IsString()
    @MaxLength(50)
    nombre!: string;

    @IsString()
    @MaxLength(10)
    unidad!: string;
}
