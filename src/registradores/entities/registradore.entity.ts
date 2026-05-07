import { create } from "domain";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ConfigRegistrador } from "../../config-registrador/entities/config-registrador.entity";
import { Lectura } from "../../lecturas/entities/lectura.entity";



@Entity('registradores')
export class Registrador {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 45, unique: true })
    nombre!: string;

    @Column({ type: 'enum', enum: ['rele', 'analizador'] })
    tipo!: 'rele' | 'analizador';

    @Column({ length: 7, name: 'head_color', default: '#4180ab' })
    headColor!: string;

    @Column({ length: 45, unique: true })
    ip!: string;

    @Column()
    puerto!: number;

    @Column({ name: 'indice_inicial' })
    indiceInicial!: number;

    @Column({ name: 'cantidad_registros' })
    cantidadRegistros!: number;

    @Column({ name: 'periodo_segundos', default: 60 })
    periodoSegundos!: number;

    @Column({ name: 'panel_superior', default: true })
    panelSuperior!: boolean;

    @Column({ name: 'panel_inferior', default: true })
    panelInferior!: boolean;

    @Column({ default: false })
    activo!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;


    @OneToMany(
        () => ConfigRegistrador,
        (configRegistrador) => configRegistrador.registrador,
        {}
    )
    configsRegistrador!: ConfigRegistrador[];

    @OneToMany(
        () => Lectura,
        (lectura) => lectura.registrador,
        {}
    )
    lecturas!: Lectura[];

}