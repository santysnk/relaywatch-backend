import { Column, Entity, OneToMany } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { ConfigRegistrador } from "../../config-registrador/entities/config-registrador.entity";
import { Lectura } from "../../lecturas/entities/lectura.entity";




@Entity('parametros')
export class Parametro {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 50, unique: true})
    nombre!: string;

    @Column({length: 10})
    unidad!: string;

    @OneToMany(
        () => ConfigRegistrador, 
        (configRegistrador) => configRegistrador.parametro,
        {}
    )
    configsRegistrador!: ConfigRegistrador[];

    @OneToMany(
        () => Lectura,
        (lectura) => lectura.parametro,
        {}
    )
    lecturas!: Lectura[];
}
