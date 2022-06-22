import { gastoProfesorResponse } from "./gastoProfesorResponse";
import { Gasto } from "./gasto";
import { Alumno } from "./alumno";

export class GastoProfesor {
  static gastoProfesorJSON(obj: gastoProfesorResponse) {
    return new GastoProfesor(
      obj['grupo'],
      obj['gastos'],
      obj['alumnosSinGasto'],
    );
  }

  constructor(
    public grupo?: string,
    public gastos?: Gasto[],
    public alumnosSinGasto?: Alumno[]
  ) { }

  get nombreGrupo() {
    return this.grupo![0] + 'º ' + this.grupo!.substring(1, this.grupo!.length);
  }

  get gastoTotalGrupo() {
    let total = 0;
    this.gastos?.forEach( x => {
      total += x.total_gastos!;
    });
    return total;
  }
}

