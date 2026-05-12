import { IsArray, IsBoolean, IsHexColor, IsIn, IsInt, IsOptional, IsString, MaxLength, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ConfigRegistradorItemDto {
    @IsInt()
    @Min(1)
    idParametro: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    idRelacionTransformacion?: number | null;
}

export class CreateRegistradorDto {
    @IsString()
    @MaxLength(45)
    nombre: string;

    @IsIn(['rele', 'analizador'])
    tipo: 'rele' | 'analizador';

    @IsOptional()
    @IsHexColor()
    headColor?: string;

    @IsString()
    @MaxLength(45)
    ip: string;

    @IsInt()
    @Min(1)
    puerto: number;

    @IsInt()
    indiceInicial: number;

    @IsInt()
    @Min(1)    
    cantidadRegistros: number;
    
    @IsOptional()
    @IsInt()    
    @Min(1)
    periodoSegundos?: number;

    @IsOptional()
    @IsBoolean()
    panelSuperior?: boolean;

    @IsOptional()
    @IsInt()
    @Min(1)
    idTituloPanelSuperior?: number;

    @IsOptional()
    @IsBoolean()
    panelInferior?: boolean;

    @IsOptional()   
    @IsInt()
    @Min(1)
    idTituloPanelInferior?: number;

    @IsOptional()
    @IsBoolean()
    activo?: boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ConfigRegistradorItemDto)
    configs?: ConfigRegistradorItemDto[];
}