import { JornadaResponse } from './jornada-response';

export class Jornada {
  static JornadaJSON(obj: JornadaResponse) {
    return new Jornada(
      obj['id_jornada'],
      obj['orden_jornada'],
      obj['fecha_jornada'],
      obj['actividades'],
      obj['observaciones'],
      obj['tiempo_empleado']
    );
  }

  constructor(
    public id_jornada: number,
    public orden_jornada: number,
    public fecha_jornada: Date,
    public actividades: string,
    public observaciones: string,
    public tiempo_empleado: number
  ) {}
}
