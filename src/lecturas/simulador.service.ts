import { Injectable } from '@nestjs/common';

export interface RegistradorDatos {
    id: number;
    ip: string;
    puerto: number;
    indiceInicial: number;
    cantidadRegistros: number;
}

// Estado de simulación de un grupo de fases (R/S/T), guardado en memoria entre
// ciclos del cron para dar continuidad temporal.
interface EstadoGrupo {
    base: number;     // valor común de las 3 fases, en "por unidad" (~1.0)
    cooldown: number; // lecturas que faltan para el próximo desbalance
}

@Injectable()
export class SimuladorService {
    private readonly TAMANO_ARRAY = 500;

    // El simulador NO genera la magnitud final (13,2kV / 33kV / 140A …): genera
    // un valor BASE alrededor de 1.0 con comportamiento realista. La magnitud
    // real la define la relación de transformación elegida por card, que con
    // base ~1 termina siendo directamente el valor a mostrar:
    //   relación "13.2/1" → 13,2 kV     "34/1" → 34 kV
    //   relación "140/1"  → 140 A       "18/1" → 18 A
    //
    // Cada grupo son las 3 fases (R/S/T) de una magnitud, según los índices
    // Modbus de la tabla `parametros`.
    private readonly GRUPOS: { nombre: string; indices: number[] }[] = [
        { nombre: 'tension', indices: [152, 153, 154] },
        { nombre: 'corriente_a', indices: [138, 139, 140] },
        { nombre: 'corriente_b', indices: [141, 142, 143] },
    ];

    // --- Parámetros del comportamiento (ajustables) ---
    private readonly BASE = 1.0;             // valor nominal (por unidad)
    private readonly VARIACION_BASE = 0.008; // cuánto se mueve el común entre periodos (≈ ±0,1 sobre 13,2kV)
    private readonly DESBALANCE = 0.008;     // corrimiento máx por fase en un desbalance (≈ ±0,1 sobre 13,2kV)
    private readonly CADA_MIN = 7;           // el desbalance ocurre cada 7…
    private readonly CADA_MAX = 10;          // …a 10 lecturas

    // Estado en memoria: registrador → grupo → EstadoGrupo
    private readonly estado = new Map<number, Map<string, EstadoGrupo>>();

    async generarValores(reg: RegistradorDatos): Promise<number[]> {
        const valores = new Array(this.TAMANO_ARRAY).fill(0);

        let grupos = this.estado.get(reg.id);
        if (!grupos) {
            grupos = new Map<string, EstadoGrupo>();
            this.estado.set(reg.id, grupos);
        }

        for (const grupo of this.GRUPOS) {
            let st = grupos.get(grupo.nombre);
            if (!st) {
                st = { base: this.BASE, cooldown: this.enteroEntre(this.CADA_MIN, this.CADA_MAX) };
                grupos.set(grupo.nombre, st);
            }

            const offsets = [0, 0, 0];
            st.cooldown -= 1;

            if (st.cooldown <= 0) {
                // Desbalance: el común se reacomoda a un valor nuevo y, en ESTA
                // lectura, 1 o 2 fases se corren unas décimas. Las lecturas
                // siguientes vuelven a quedar equilibradas en el nuevo común.
                st.base = this.BASE + (Math.random() * 2 - 1) * this.VARIACION_BASE;
                const cuantas = Math.random() < 0.5 ? 1 : 2;
                for (const fase of this.elegirFases(cuantas)) {
                    offsets[fase] = (Math.random() * 2 - 1) * this.DESBALANCE;
                }
                st.cooldown = this.enteroEntre(this.CADA_MIN, this.CADA_MAX);
            }

            grupo.indices.forEach((indice, i) => {
                valores[indice - 1] = this.redondear(st!.base + offsets[i], 5);
            });
        }

        return valores;
    }

    /** Elige `cuantas` fases distintas (0,1,2) al azar. */
    private elegirFases(cuantas: number): number[] {
        const fases = [0, 1, 2];
        for (let i = fases.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fases[i], fases[j]] = [fases[j], fases[i]];
        }
        return fases.slice(0, cuantas);
    }

    private enteroEntre(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private redondear(valor: number, decimales: number): number {
        const f = 10 ** decimales;
        return Math.round(valor * f) / f;
    }
}
