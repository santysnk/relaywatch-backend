import { IsBoolean, IsHexColor, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateRegistradorDto {
    @IsString()
    @MaxLength(45)
    nombre!: string;

    @IsIn(['rele', 'analizador'])
    tipo!: 'rele' | 'analizador';

    @IsOptional()
    @IsHexColor()
    headColor?: string;

    @IsString()
    @MaxLength(45)
    ip!: string;

    @IsInt()
    @Min(1)
    puerto!: number;

    @IsInt()
    indiceInicial!: number;

    @IsInt()
    @Min(1)    
    cantidadRegistros!: number;
    
    @IsOptional()
    @IsInt()    
    @Min(1)
    periodoSegundos?: number;

    @IsOptional()
    @IsBoolean()
    panelSuperior?: boolean;

    @IsOptional()
    @IsBoolean()
    panelInferior?: boolean;

    @IsOptional()
    @IsBoolean()
    activo?: boolean;

}