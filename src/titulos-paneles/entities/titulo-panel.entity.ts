import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Registrador } from '../../registradores/entities/registrador.entity';


@Entity('Titulos_paneles')
export class TituloPanel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    nombre: string;

    // Relación inversa #1: registradores que usan este título en el panel SUPERIOR
    @OneToMany(
        () => Registrador,
        (registrador) => registrador.tituloPanelSuperior,
    )
    registradoresUsandoComoSuperior: Registrador[];

    // Relación inversa #2: registradores que usan este título en el panel INFERIOR
    @OneToMany(
        () => Registrador,
        (registrador) => registrador.tituloPanelInferior,
    )
    registradoresUsandoComoInferior: Registrador[];

}

