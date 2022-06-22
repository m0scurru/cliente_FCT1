import { Alumno } from './alumno';
import { Convenio } from './convenio';
import { EmpresaResponse } from './empresaResponse';
import { Trabajador } from './trabajador';

export class Empresa {
  static empresaJSON(obj: EmpresaResponse) {
    return new Empresa(
      obj['id'],
      obj['cif'],
      obj['nombre'],
      obj['email'],
      obj['telefono'],
      obj['localidad'],
      obj['provincia'],
      obj['direccion'],
      obj['cp'],
      obj['representante'],
      obj['nombre_responsable'],
      obj['dni_responsable'],
      obj['alumnos'],
      obj['convenio'],
      obj['es_privada'],
    );
  }

  constructor(
    public id: string,
    public cif: string,
    public nombre: string,
    public email: string,
    public telefono: string,
    public localidad: string,
    public provincia: string,
    public direccion: string,
    public cp: string,
    public representante?: Trabajador,
    public nombre_responsable?: string,
    public dni_responsable?: string,
    public alumnos?: Alumno[],
    public convenio?: Convenio | null,
    public es_privada?: boolean
  ) {}

  /**
   * Comprueba si el convenio con una empresa, de existir, es renovable.
   * Es decir, comprueba si queda menos de un año para que el convenio caduque
   *
   * @returns true si el convenio se puede renovar, false si no
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isConvenioRenovable(): boolean {
    if (this.convenio) {
      if (this.convenio.fecha_fin) {

        var diff_ms = Date.now() - new Date(this.convenio.fecha_fin).getTime();
        var age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970) < 2;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Comprueba qué tipo de convenio se puede hacer con una empresa, según si es pública o privada
   *
   * @return 'convenio' si la empresa es privada, 'acuerdo' si es pública
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  get acuerdoOConvenio(): string {
    return this.es_privada ? 'convenio' : 'acuerdo';
  }
}
