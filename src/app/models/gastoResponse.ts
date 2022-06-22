import { FacturaManutencion } from "./facturaManutencion";
import { FacturaTransporte } from "./facturaTransporte";

export interface gastoResponse {
  dni_alumno?: string,
  curso_academico?: string,
  tipo_desplazamiento?: string,
  total_gastos?: number,
  residencia_alumno?: string,
  ubicacion_centro_trabajo?: string,
  distancia_centroEd_centroTra?: number,
  distancia_centroEd_residencia?: number,
  distancia_centroTra_residencia?: number,
  dias_transporte_privado?: number,
  sumatorio_gasto_vehiculo_privado?: number,
  sumatorio_gasto_transporte_publico?: number,
  sumatorio_gasto_manutencion?: number,
  facturasTransporte?: FacturaTransporte[],
  facturasManutencion?: FacturaManutencion[],
  nombre_alumno?: string
}
