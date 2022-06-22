import { CentroEstudios } from './centroEstudios';
import { ConvenioResponse } from './convenioResponse';
import { Empresa } from './empresa';

export class Convenio {
  static empresaJSON(obj: ConvenioResponse) {
    return new Convenio(
      obj['cod_convenio'],
      obj['cod_centro'],
      obj['id_empresa'],
      obj['fecha_ini'],
      obj['fecha_fin'],
      obj['ruta_anexo'],
      obj['centro'],
      obj['empresa'],
    );
  }

  constructor(
    public cod_convenio: string,
    public cod_centro: string,
    public id_empresa: number,
    public fecha_ini: Date,
    public fecha_fin: Date,
    public ruta_anexo: string,
    public centro?: CentroEstudios,
    public empresa?: Empresa,
  ) {}

  /**
   * Comprueba si el convenio, es renovable.
   * Es decir, comprueba si queda menos de un año para que el convenio caduque
   *
   * @returns true si el convenio se puede renovar, false si no
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isRenovable(): boolean {
    if (this.fecha_fin) {
      var diff_ms = Date.now() - new Date(this.fecha_fin).getTime();
      var age_dt = new Date(diff_ms);

      return Math.abs(age_dt.getUTCFullYear() - 1970) < 2;
    } else {
      return false;
    }
  }

  /**
   * Devuelve el número del código de convenio que se concatena a la 'A' o la 'C'
   *
   * @returns El número del código del convenio
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getNum(): number {
    let part = this.cod_convenio.split('/')[0];
    return parseInt(part.substring(1));
  }
}
