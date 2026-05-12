import { Column, Entity, OneToMany, Unique } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { ConfigRegistrador } from "../../config-registrador/entities/config-registrador.entity";
import { Lectura } from "../../lecturas/entities/lectura.entity";

@Entity('parametros')
@Unique(['nombre', 'indiceParametro'])
export class Parametro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50})
    nombre: string;

    @Column({length: 10})
    unidad: string;

    @Column({name: 'indice_parametro'})
    indiceParametro: number;

    @OneToMany(
        () => ConfigRegistrador, 
        (configRegistrador) => configRegistrador.parametro,
        {}
    )
    configsRegistrador: ConfigRegistrador[];

    @OneToMany(
        () => Lectura,
        (lectura) => lectura.parametro,
        {}
    )
    lecturas: Lectura[];
}
