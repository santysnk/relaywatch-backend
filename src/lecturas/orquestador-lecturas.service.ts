import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registrador } from '../registradores/entities/registrador.entity';
import { Parametro } from '../parametros/entities/parametro.entity';
import { SimuladorService } from './simulador.service';
import { LecturasService } from './lecturas.service';
import { ConfigRegistrador } from '../config-registrador/entities/config-registrador.entity';

@Injectable()
export class OrquestadorLecturasService {

    private readonly logger = new Logger(OrquestadorLecturasService.name);

    constructor(
        @InjectRepository(Registrador)
        private readonly registradorRepo: Repository<Registrador>,

        @InjectRepository(ConfigRegistrador)
        private readonly configRepo: Repository<ConfigRegistrador>,

        private readonly simulador: SimuladorService,
        private readonly lecturasService: LecturasService,
    ) { }


    @Cron(CronExpression.EVERY_MINUTE)
    async procesarLecturas(): Promise<void> {

        // ─── 1. Traer registradores activos ───────────────────────────
        const activos = await this.registradorRepo.find({
            where: { activo: true }
        });

        if (activos.length === 0) {
            this.logger.log('No hay registradores activos.');
            return;
        }

        for (const registrador of activos) {
            try {
                await this.procesarRegistrador(registrador);
            } catch (error: any) {
                this.logger.error(`Error al procesar registrador ${registrador.id}: ${error.message}`);
            }
        }
    };

    private async procesarRegistrador(registrador: Registrador): Promise<void> {
        const valoresCrudos = await this.simulador.generarValores({
            ip: registrador.ip,
            puerto: registrador.puerto,
            indiceInicial: registrador.indiceInicial,
            cantidadRegistros: registrador.cantidadRegistros,
        });

        const config = await this.configRepo.find({
            where: { idRegistrador: registrador.id },
            relations: ['parametro', 'relacionTransformacion'],
        });

        const lecturas = config
            .map((config) => {
                const posicion = config.parametro.indiceParametro - 1; // Ajuste a índice 0-based

                if (posicion < 0 || posicion >= valoresCrudos.length) {
                    this.logger.log(`Parámetro ${config.parametro.indiceParametro} (dir: ${config.parametro.indiceParametro}) fuera de rango para registrador ${registrador.nombre}`);
                    return null;
                }

                const valorSecundario = valoresCrudos[posicion];
                const valorReal = this.aplicarTransformacion(
                    valorSecundario,
                    config.relacionTransformacion,
                );

                return {
                    idRegistrador: registrador.id,
                    idParametro: config.parametro.id,
                    valor: valorReal,
                };
            })
            .filter((l): l is NonNullable<typeof l> => l !== null);

        if (lecturas.length > 0) {
            await this.lecturasService.crearMuchas(lecturas);
            this.logger.log(${ registrador.nombre }: ${ lecturas.length } lecturas guardadas);
        }
    }

    private aplicarTransformacion(
        valor: number,
        relacion: RelacionTransformacion | null,
    ): number {
        if (!relacion) return valor;

        const [primario, secundario] = relacion.relacion.split('/').map(Number);
        if (isNaN(primario) || isNaN(secundario) || secundario === 0) {
            this.logger.warn(Relación de transformación inválida: "${relacion.relacion}");
            return valor;
        }

        return Math.round((valor * (primario / secundario)) * 10000) / 10000;
    }
}



