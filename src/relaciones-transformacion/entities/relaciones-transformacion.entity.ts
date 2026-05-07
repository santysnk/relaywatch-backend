import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ConfigRegistrador } from "../../config-registrador/entities/config-registrador.entity";



@Entity('relaciones_transformacion')
export class RelacionesTransformacion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 50})
    relacion!: string;

    @OneToMany(
        () => ConfigRegistrador, 
        (configRegistrador) => configRegistrador.relacionTransformacion,
        {}
    )
    configsRegistrador!: ConfigRegistrador[];
    
}
