import { Injectable, Logger } from '@nestjs/common';


export interface RegistradorDatos {
    ip: string;
    puerto: number;
    indiceInicial: number;
    cantidadRegistros: number;
}

@Injectable()
export class SimuladorService {
    // Rangos realistas para la red eléctrica de media tensión.
    // No están en la DB a propósito — son una característica del simulador,
    // no del dominio real (en producción los valores vendrían del hardware).
    private readonly TENSION_MIN = 12.9;   // kV
    private readonly TENSION_MAX = 13.8;   // kV
    private readonly CORRIENTE_MIN = 0.2;   // A
    private readonly CORRIENTE_MAX = 0.8;   // A


    async generarValores(registrador: RegistradorDatos): Promise<number[]> {
        return [
            this.random(this.TENSION_MIN, this.TENSION_MAX),     // 0
            this.random(this.TENSION_MIN, this.TENSION_MAX),     // 1
            this.random(this.TENSION_MIN, this.TENSION_MAX),     // 2
            this.random(this.CORRIENTE_MIN, this.CORRIENTE_MAX), // 3
            this.random(this.CORRIENTE_MIN, this.CORRIENTE_MAX), // 4
            this.random(this.CORRIENTE_MIN, this.CORRIENTE_MAX), // 5
        ];
    }

    /**
     * Helper: número aleatorio entre min y max, redondeado a 4 decimales
     * (para coincidir con la precisión DECIMAL(15,4) de la columna valor
     * en la tabla lecturas).
     */
    private random(min: number, max: number): number {
        const valor = Math.random() * (max - min) + min;
        return Math.round(valor * 10000) / 10000;
    }
}