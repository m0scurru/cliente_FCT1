/**
 * Modelo para Respuesta
 * @author Pablo G. Galan <pablosiege@gmail.com>
 */
export class RespuestaModel {

  id_cuestionario!: number;
  tipo!: string;
  pregunta!: string;
  respuesta!: string;

  setRespuesta(_respuesta: unknown) {
    const respuesta = _respuesta as RespuestaModel;
    this.id_cuestionario = respuesta.id_cuestionario || 0;
    this.tipo = respuesta.tipo || '';
    this.pregunta = respuesta.pregunta || '';
    this.respuesta = respuesta.respuesta || '';
  }
}
