export interface facturaTransporteResponse {
  id: number,
  dni_alumno: string,
  curso_academico: string,
  fecha: Date,
  importe: number,
  origen: string,
  destino: string,
  imagen_ticket: string
}
