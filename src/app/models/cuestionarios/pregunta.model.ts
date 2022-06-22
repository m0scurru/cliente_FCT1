/**
 * Modelo para las preguntas de cuestionario.
 * @author Pablo G. Galan <pablosiege@gmail.com>
 */
export class PreguntaModel {

  id!: number;
  id_cuestionario!: number;
  tipo!: string;
  pregunta!: string;

  setPregunta(_pregunta: unknown) {
    const pregunta = _pregunta as PreguntaModel;
    this.id = pregunta.id || 0;
    this.id_cuestionario = pregunta.id_cuestionario || 0;
    this.tipo = pregunta.tipo || '';
    this.pregunta = pregunta.pregunta || '';
  }
}
