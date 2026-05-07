import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('lecturas')
export class Lectura {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id!: number;

    @Column({name: 'id_registrador'})
    idRegistrador!: number;

    @Column({name: 'id_parametro'})
    idParametro!: number;

    @Column({type: 'decimal', precision: 15, scale: 4})
    valor!: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt!: Date;
}
