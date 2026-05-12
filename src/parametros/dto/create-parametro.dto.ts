import { IsInt, IsString, MaxLength, Min } from "class-validator";

export class CreateParametroDto {

    @IsString()
    @MaxLength(50)
    nombre: string;

    @IsString()
    @MaxLength(10)
    unidad: string;

    @IsInt()
    @Min(0)
    indiceParametro: number;
}
