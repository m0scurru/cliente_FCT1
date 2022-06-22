import { PreguntaModel } from "./pregunta.model";

/**
 * Modelo para cuestionario tutor empresa.
 * @author Pablo G. Galan <pablosiege@gmail.com>
 */
export class CuestionarioTutorEmpresaModel {

  id!: number;
  dni_alumno!: string;
  curso_academico!: string;
  cod_centro!: string;
  cod_grupo!: string;
  respondido!: boolean;


  setCuestionarioTutorEmpresa(_cuestionarioTutorEmpresa: unknown) {
    const cuestionarioTutorEmpresa = _cuestionarioTutorEmpresa as CuestionarioTutorEmpresaModel;
    this.id = cuestionarioTutorEmpresa.id || 0 ;
    this.dni_alumno = cuestionarioTutorEmpresa.dni_alumno || '' ;
    this.curso_academico = cuestionarioTutorEmpresa.curso_academico || '';
    this.cod_centro = cuestionarioTutorEmpresa.cod_centro || '';
    this.cod_grupo = cuestionarioTutorEmpresa.cod_grupo || '';
    this.respondido = cuestionarioTutorEmpresa.respondido || false;
  }
}
