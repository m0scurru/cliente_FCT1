import { PreguntaModel } from "./pregunta.model";

/**
 * Modelo para cuestionario.
 * @author Pablo G. Galan <pablosiege@gmail.com>
 */
export class CuestionarioModel {

  id!: number;
  titulo!: string;
  destinatario!: string;
  codigo_centro!: string;
  preguntas!: Array<PreguntaModel>;
  activo!: boolean;


  setCuestionario(_cuestionario: unknown) {
    const cuestionario = _cuestionario as CuestionarioModel;
    this.id = cuestionario.id || 0 ;
    this.titulo = cuestionario.titulo || '';
    this.destinatario = cuestionario.destinatario || '';
    this.codigo_centro = cuestionario.codigo_centro || '';
    this.preguntas = cuestionario.preguntas || [];
    this.activo = cuestionario.activo || false;
  }
}
