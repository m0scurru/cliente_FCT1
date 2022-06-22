import { facturaTransporteResponse } from './facturaTransporteResponse';

export class FacturaTransporte {
  static facturaTransporteJSON(obj: facturaTransporteResponse) {
    return new FacturaTransporte(
      obj['id'],
      obj['dni_alumno'],
      obj['curso_academico'],
      obj['fecha'],
      obj['importe'],
      obj['origen'],
      obj['destino'],
      obj['imagen_ticket']
    );
  }

  constructor(
    public id?: number,
    public dni_alumno?: string,
    public curso_academico?: string,
    public fecha?: Date,
    public importe?: number,
    public origen?: string,
    public destino?: string,
    public imagen_ticket?: string
  ){}
}
