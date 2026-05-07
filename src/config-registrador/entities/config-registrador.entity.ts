import { Column, Entity, ManyToOne, PrimaryGeneratedColumn,JoinColumn} from "typeorm";
import { Registrador } from "../../registradores/entities/registradore.entity";
import { RelacionesTransformacion } from "../../relaciones-transformacion/entities/relaciones-transformacion.entity";
import { Parametro } from "../../parametros/entities/parametro.entity";     



@Entity('config_registrador')
export class ConfigRegistrador {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'id_registrador' })
    idRegistrador!: number;

    @Column({ name: 'id_parametro' })
    idParametro!: number;

    @Column({ name: 'id_relacion_transformacion', nullable: true })
    idRelacionTransformacion!: number | null;


    @ManyToOne(
        () => Registrador,
        (registrador) => registrador.configsRegistrador,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({ name: 'id_registrador' })
    registrador!: Registrador;


    @ManyToOne(
        () => Parametro,
        (parametro) => parametro.configsRegistrador,
        {
            onDelete: 'RESTRICT'
        }
    )
    @JoinColumn({ name: 'id_parametro' })
    parametro!: Parametro;

    @ManyToOne(
        () => RelacionesTransformacion,
        (relacionTransformacion) => relacionTransformacion.configsRegistrador,
        {
            onDelete: 'SET NULL',
            nullable: true  ,
        }
    )
    @JoinColumn({ name: 'id_relacion_transformacion'})
    relacionTransformacion!: RelacionesTransformacion | null;
}

    
