import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Registrador } from "../../registradores/entities/registrador.entity";
import { Parametro } from "../../parametros/entities/parametro.entity";



@Entity('lecturas')
export class Lectura {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column({ name: 'id_registrador' })
    idRegistrador: number;

    @Column({ name: 'id_parametro' })
    idParametro: number;

    @Column({ type: 'decimal', precision: 15, scale: 4 })
    valor: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(
        () => Registrador,
        (registrador) => registrador.lecturas,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({ name: 'id_registrador' })
    registrador: Registrador;


    @ManyToOne(
        () => Parametro,
        (parametro) => parametro.lecturas,
        {
            onDelete: 'RESTRICT',
        }
    )
    @JoinColumn({ name: 'id_parametro' })
    parametro: Parametro ;
}
