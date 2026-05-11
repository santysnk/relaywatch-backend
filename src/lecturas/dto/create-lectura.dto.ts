import { IsInt, Min, IsNumber} from "class-validator";


export class CreateLecturaDto {

    @IsInt()
    @Min(1)
    idRegistrador: number;

    @IsInt()
    @Min(1)
    idParametro: number;

    @IsNumber(
        { maxDecimalPlaces: 4 },
            { message: 'El valor debe ser un número con hasta 4 decimales' }
    )
    valor: number;



}
