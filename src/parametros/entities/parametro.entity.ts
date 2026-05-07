import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";




@Entity('parametros')
export class Parametro {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 50, unique: true})
    nombre!: string;

    @Column({length: 10})
    unidad!: string;
}
