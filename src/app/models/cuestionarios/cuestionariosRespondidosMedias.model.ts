/**
 * Modelo para las medias de los cuestionarios.
 * @author Pablo G. Galan <pablosiege@gmail.com>
 */
export class CuestionariosRespondidosMediasModel {

  name!: string;
  value!: number;

  setCuestionario(_cuestionario: unknown) {
    const cuestionarioRespondidoMedia = _cuestionario as CuestionariosRespondidosMediasModel;
    this.name = cuestionarioRespondidoMedia.name || '' ;
    this.value = cuestionarioRespondidoMedia.value || 0 ;
  }
}
