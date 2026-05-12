import { IsString, MaxLength } from "class-validator";


export class CreateTituloPanelDto {
    @IsString()
    @MaxLength(100)
    nombre: string;

}
