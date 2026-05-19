import { Entity,PrimaryGeneratedColumn,Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity ('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    nombre: string;

    @Column({length: 100})
    apellido: string;

    @Column({length: 255, unique: true})
    email: string;

    @Column({length: 255, name: 'password_hash', select: false})
    passwordHash: string;

    @Column({type: 'enum', enum: ['admin', 'invitado'], default: 'invitado'})
    rol: 'admin' | 'invitado';

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
