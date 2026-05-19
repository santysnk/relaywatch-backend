import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registrador } from '../registradores/entities/registrador.entity';
import { Parametro } from '../parametros/entities/parametro.entity';
import { SimuladorService } from './simulador.service';
import { LecturasService } from './lecturas.service';
import { ConfigRegistrador } from '../config-registrador/entities/config-registrador.entity';
import { config } from 'process';



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
    async correrCiclo(): Promise<void> {

        // ─── 1. Traer registradores activos ───────────────────────────
        const registradoresActivos = await this.registradorRepo.find({
            where: { activo: true }
        });

        if (registradoresActivos.length === 0) {
            this.logger.log('No hay registradores activos. Salteamos este ciclo.');
            return;
        }        

        for (const registrador of registradoresActivos) {
            // Traer configs CON la relación de transformación además del parámetro
            const configs = await this.configRepo.find({
                where: { idRegistrador: registrador.id },
                relations: ['parametro', 'parametro.transformacion']
            });
        
        if(configs.length === 0) {
            this.logger.log(`El registrador ${registrador.nombre} (id: ${registrador.id}) no tiene parámetros configurados.`);
            continue;
        }

        const todasLasLecturas: Array<{
            idRegistrador: number;
            idParametro: number;
            valor: number;
        }> = [];

        // El simulador devuelve los valores CRUDOS sin transformar.
        const valoresSimulados = await this.simulador.generarValores({
            ip: registrador.ip,
            puerto: registrador.puerto,
            indiceInicial: registrador.indiceInicial,
            cantidadRegistros: registrador.cantidadRegistros
        });

        // Por cada config, tomar el crudo en su índice y aplicar la transformación
        for (const config of configs) {
            const indice = config.parametro.indiceParametro;

            if (indice >= valoresSimulados.length) {
                this.logger.log(``);
                continue;
            }













            // ─── 2. Traer todos los parámetros, ordenados por indice_parametro ────
            // El orden ASC asegura: parametros[0] → indice=0, parametros[1] → indice=1, etc.
            // Esto se alinea con el array que devuelve el simulador (posición i = indice_parametro i).
            const parametros = await this.parametroRepo.find({
                order: { indiceParametro: 'ASC' }
            });



            // ─── 3. Recorrer cada registrador y armar sus lecturas ────────────



            // ─── 4. Persistir todas las lecturas en un solo INSERT ────────────

        }
    }
};

