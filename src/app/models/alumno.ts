import { alumnoResponse } from './alumnoResponse';

export class Alumno {
  static alumnoJSON(obj: alumnoResponse) {
    return new Alumno(
      obj['nombre'],
      obj['dni'],
      obj['va_a_fct'],
      obj['horario'],
      obj['fecha_ini'],
      obj['fecha_fin']
    );
  }

  //Cambio 02-03-2022 David Sánchez Barragán
  //Incorporación campos para gestión alumnos
  static alumnoCompletoJSON(obj: alumnoResponse) {
    return new Alumno(
      obj['nombre'],
      obj['dni'],
      obj['va_a_fct'],
      obj['horario'],
      obj['fecha_ini'],
      obj['fecha_fin'],
      obj['cod_alumno'],
      obj['email'],
      obj['apellidos'],
      obj['password'],
      obj['provincia'],
      obj['localidad'],
      obj['dni_antiguo'],
      obj['matricula_cod'],
      obj['matricula_cod_centro'],
      obj['matricula_cod_grupo'],
      obj['foto'],
      obj['curriculum'],
      obj['cuenta_bancaria'],
      obj['matricula_coche'],
      obj['fecha_nacimiento'],
      obj['domicilio'],
      obj['telefono'],
      obj['movil']
    );
  }

  constructor(
    public nombre: string,
    public dni: string,
    public va_a_fct: number,
    public horario?: string,
    public fecha_ini?: Date,
    public fecha_fin?: Date,

    //Cambio 02-03-2022 David Sánchez Barragán
    //Incorporación campos para gestión alumnos
    public cod_alumno?: number,
    public email?: string,
    public apellidos?: string,
    public password?: string,
    public provincia?: string,
    public localidad?: string,
    public dni_antiguo?: string,
    public matricula_cod?: string,
    public matricula_cod_centro?: string,
    public matricula_cod_grupo?: string,

    //Cambio 11-04-2022 David Sánchez Barragán
    //Incorporación de cambios para Anexo FEM05
    public foto?: string,
    public curriculum?: string,
    public cuenta_bancaria?: string,
    public matricula_coche?: string,
    public fecha_nacimiento?: Date,
    public domicilio?: string,
    public telefono?: string,
    public movil?: string
  ) {}

  /**
   * Devuelve el nombre completo de un alumno
   * @returns nombre y apellidos del alumno
   * @author David Sánchez Barragán
   */
  get nombreCompleto() {
    return this.nombre + ' ' + this.apellidos;
  }
}
