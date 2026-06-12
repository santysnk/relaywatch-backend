import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { ConfigRegistrador } from "../../config-registrador/entities/config-registrador.entity";
import { Lectura } from "../../lecturas/entities/lectura.entity";
import { TituloPanel } from "../../titulos-paneles/entities/titulo-panel.entity";



@Entity('registradores')
export class Registrador {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 45, unique: true })
    nombre: string;

    @Column({ type: 'enum', enum: ['rele', 'analizador'] })
    tipo: 'rele' | 'analizador';

    @Column({ length: 7, name: 'head_color', default: '#4180ab' })
    headColor: string;

    @Column({ length: 45, unique: true })
    ip: string;

    @Column()
    puerto: number;

    @Column({ name: 'indice_inicial' })
    indiceInicial: number;

    @Column({ name: 'cantidad_registros' })
    cantidadRegistros: number;

    @Column({ name: 'periodo_segundos', default: 60 })
    periodoSegundos: number;

    @Column({ name: 'panel_superior', default: true })
    panelSuperior: boolean;

    @Column({ name: 'id_titulo_panel_superior', default: 1 })
    idTituloPanelSuperior: number;

    @Column({ name: 'panel_inferior', default: true })
    panelInferior: boolean;

    @Column({ name: 'id_titulo_panel_inferior', default: 1 })
    idTituloPanelInferior: number;

    @Column({ default: false })
    activo: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Soft delete: NULL = vivo, con fecha = eliminado. Con este decorador,
    // TypeORM excluye automáticamente los eliminados de todos los find()
    // y softRemove() setea la fecha en vez de borrar la fila.
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;


    @OneToMany(
        () => ConfigRegistrador,
        (configRegistrador) => configRegistrador.registrador,
        {}
    )
    configsRegistrador: ConfigRegistrador[];

    @OneToMany(
        () => Lectura,
        (lectura) => lectura.registrador,
        {}
    )
    lecturas: Lectura[];

    @ManyToOne(
        () => TituloPanel,
        (titulo) => titulo.registradoresUsandoComoSuperior,
        { onDelete: 'RESTRICT' }
    )
    @JoinColumn({ name: 'id_titulo_panel_superior' })
    tituloPanelSuperior: TituloPanel;

    @ManyToOne(
        () => TituloPanel,
        (titulo) => titulo.registradoresUsandoComoInferior,
        { onDelete: 'RESTRICT' }
    )
    @JoinColumn({ name: 'id_titulo_panel_inferior' })
    tituloPanelInferior: TituloPanel;

}