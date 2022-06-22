import { anexoAlumnoResponse } from './anexoAlumnoResponse';

export class AnexoAlumno {
  static anexoJSON(obj: anexoAlumnoResponse) {
    return new AnexoAlumno(
      obj['nombre'],
      obj['relleno'],
      obj['codigo'],
      obj['fecha']
    );
  }

  constructor(
    public nombre: string,
    public relleno: string,
    public codigo: string,
    public fecha: string
  )
  {}
}
