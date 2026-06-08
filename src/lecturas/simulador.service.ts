import { Injectable, Logger } from '@nestjs/common';


export interface RegistradorDatos {
    ip: string;
    puerto: number;
    indiceInicial: number;
    cantidadRegistros: number;
}

@Injectable()
export class SimuladorService {
    // Tamaño del array simulado: cubre el rango util del REF615 
    private readonly TAMAÑO_ARRAY = 500;

    // Rangos realistas para la red eléctrica de media tensión.
    // No están en la DB a propósito — son una característica del simulador,
    // no del dominio real (en producción los valores vendrían del hardware).
    private readonly TENSION_MIN = 12.9;   // kV
    private readonly TENSION_MAX = 13.8;   // kV
    private readonly CORRIENTE_MIN = 5.2;   // A
    private readonly CORRIENTE_MAX = 5.8;   // A

    // Direcciones Modbus del REF615 (1-based, igual que en el manual ABB)
    // En el array las accedemos como (dirección - 1)
    private readonly POSICIONES_CORRIENTE = [138, 139, 140];
    private readonly POSICIONES_TENSION = [152, 153, 154];


    async generarValores(registrador: RegistradorDatos): Promise<number[]> {
        const valores = new Array(this.TAMAÑO_ARRAY).fill(0);

        for(const indice of this.POSICIONES_CORRIENTE) {
            valores[indice - 1] = this.random(this.CORRIENTE_MIN, this.CORRIENTE_MAX);
        }

        for(const indice of this.POSICIONES_TENSION) {
            valores[indice - 1] = this.random(this.TENSION_MIN, this.TENSION_MAX);
        }

        return valores;
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