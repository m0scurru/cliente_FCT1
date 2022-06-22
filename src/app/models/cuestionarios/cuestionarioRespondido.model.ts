import { RespuestaModel } from "./respuesta.model";

/**
 * Modelo para cuestionario respondido.
 * @author Pablo G. Galan <pablosiege@gmail.com>
 */
export class CuestionarioRespondidoModel {

  id!: number;
  id_usuario!: string;
  titulo!: string;
  destinatario!: string;
  respuestas!: Array<RespuestaModel>;
  ciclo!: string;

  setCuestionario(_cuestionario: unknown) {
    const cuestionarioRespondido = _cuestionario as CuestionarioRespondidoModel;
    this.id = cuestionarioRespondido.id || 0 ;
    this.id_usuario = cuestionarioRespondido.id_usuario || '' ;
    this.titulo = cuestionarioRespondido.titulo || '';
    this.destinatario = cuestionarioRespondido.destinatario || '';
    this.respuestas = cuestionarioRespondido.respuestas || [];
    this.ciclo = cuestionarioRespondido.ciclo || '';
  }
}
