import { IsString, MaxLength, Matches } from "class-validator";


export class CreateRelacionesTransformacionDto {
    
    @IsString()
    @MaxLength(50)
    @Matches(/^\d+\/\d+$/, {
    message: 'relacion debe tener formato "entero/entero" (ej. "13800/110" o "100/5")',
})
    relacion: string;

}
