import { facturaManutencionResponse } from "./facturaManutencionResponse";

export class FacturaManutencion {
  static facturaManutencionJSON(obj: facturaManutencionResponse ) {
    return new FacturaManutencion(
      obj['id'],
      obj['dni_alumno'],
      obj['curso_academico'],
      obj['fecha'],
      obj['importe'],
      obj['imagen_ticket']
    );
  }

  constructor(
    public id?: number,
    public dni_alumno?: string,
    public curso_academico?: string,
    public fecha?: Date,
    public importe?: number,
    public imagen_ticket?: string
  ){}
}
