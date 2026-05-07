import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('config_registrador')
export class ConfigRegistrador {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name: 'id_registrador'})
    idRegistrador!: number;

    @Column({name: 'id_parametro'})
    idParametro!: number;

    @Column({name: 'id_relacion_transformacion', nullable: true})
    idRelacionTransformacion!: number;
}
