import { FacturaManutencion } from "./facturaManutencion";
import { FacturaTransporte } from "./facturaTransporte";
import { gastoResponse } from "./gastoResponse";

export class Gasto {
  static gastoJSON(obj: gastoResponse) {
    return new Gasto(
      obj['dni_alumno'],
      obj['curso_academico'],
      obj['tipo_desplazamiento'],
      obj['total_gastos'],
      obj['residencia_alumno'],
      obj['ubicacion_centro_trabajo'],
      obj['distancia_centroEd_centroTra'],
      obj['distancia_centroEd_residencia'],
      obj['distancia_centroTra_residencia'],
      obj['dias_transporte_privado'],
      obj['sumatorio_gasto_vehiculo_privado'],
      obj['sumatorio_gasto_transporte_publico'],
      obj['sumatorio_gasto_manutencion'],
      obj['facturasTransporte'],
      obj['facturasManutencion'],
      obj['nombre_alumno']
    );
  }

  constructor(
    public dni_alumno?: string,
    public curso_academico?: string,
    public tipo_desplazamiento?: string,
    public total_gastos?: number,
    public residencia_alumno?: string,
    public ubicacion_centro_trabajo?: string,
    public distancia_centroEd_centroTra?: number,
    public distancia_centroEd_residencia?: number,
    public distancia_centroTra_residencia?: number,
    public dias_transporte_privado?: number,
    public sumatorio_gasto_vehiculo_privado?: number,
    public sumatorio_gasto_transporte_publico?: number,
    public sumatorio_gasto_manutencion?: number,
    public facturasTransporte?: FacturaTransporte[],
    public facturasManutencion?: FacturaManutencion[],
    public nombre_alumno?: string
  ) { }
}
