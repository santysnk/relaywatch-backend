import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('relaciones_transformacion')
export class RelacionesTransformacion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 50})
    relacion!: string;

    
}
