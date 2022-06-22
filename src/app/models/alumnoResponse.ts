export interface alumnoResponse {
  nombre: string;
  dni: string;
  va_a_fct: number;
  horario?: string;
  fecha_ini?: Date;
  fecha_fin?: Date;

  //Cambio 02-03-2022 David Sánchez Barragán
  //Incorporación campos para gestión alumnos
  cod_alumno?: number;
  email?: string;
  apellidos?: string;
  password?: string;
  provincia?: string;
  localidad?: string;
  dni_antiguo?: string;
  matricula_cod?: string;
  matricula_cod_centro?: string;
  matricula_cod_grupo?: string;

  //Cambio 11-04-2022 David Sánchez Barragán
  //Incorporación de cambios para Anexo FEM05
  foto?: string;
  curriculum?: string;
  cuenta_bancaria?: string;
  matricula_coche?: string;
  fecha_nacimiento?: Date;
  domicilio?: string;
  telefono?: string;
  movil?: string;
}
