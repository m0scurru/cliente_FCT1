import { Alumno } from "./alumno"
import { Gasto } from "./gasto"

export interface gastoProfesorResponse {
  grupo?: string,
  gastos?: Gasto[],
  alumnosSinGasto?: Alumno[]
}
