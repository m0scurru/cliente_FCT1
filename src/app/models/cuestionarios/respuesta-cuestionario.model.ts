import { RespuestaModel } from "./respuesta.model";

/**
 * Modelo para respuesta cuestionario.
 * @author Pablo G. Galan <pablosiege@gmail.com>
 */
export class RespuestaCuestionarioModel {
  id!: number;
  id_usuario!: string;
  titulo!: string;
  destinatario!: string;
  codigo_centro!: string;
  ciclo!: string;
  curso_academico!: string;
  dni_tutor_empresa!: string|null;
  respuestas!: Array<RespuestaModel>;


  setCuestionario(_cuestionario: unknown) {
    const cuestionario = _cuestionario as RespuestaCuestionarioModel;
    this.id = cuestionario.id || 0 ;
    this.id_usuario = cuestionario.id_usuario || '' ;
    this.titulo = cuestionario.titulo || '';
    this.destinatario = cuestionario.destinatario || '';
    this.codigo_centro = cuestionario.codigo_centro || '';
    this.ciclo = cuestionario.ciclo || '';
    this.curso_academico = cuestionario.curso_academico || '';
    this.dni_tutor_empresa = cuestionario.dni_tutor_empresa || '-';
    this.respuestas = cuestionario.respuestas || [];
  }
}
