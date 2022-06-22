/**
 * Clase que gestiona las fases de un formulario, definiendo su número,
 * su nombre y si es accesible o no desde el navegador.
 * Se inicializa como no accesible por defecto.
 */
export class FaseForm {
  public index: number;
  public nombre: string;
  public abreviatura: string;
  public accesible: boolean;

  public constructor(index: number, nombre: string, abreviatura: string) {
    this.index = index;
    this.nombre = nombre;
    this.abreviatura = abreviatura;
    this.accesible = false;
  }

  /***********************************************************************/
  //#region Activación de fase

  /**
   * Activa una fase del formulario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public activar(): void {
    this.accesible = true;
  }

  /**
   * Desactiva una fase del formulario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public desactivar(): void {
    this.accesible = false;
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Comprobación de estado de la fase

  /**
   * Comprueba si una fase del formulario está completada comparándola
   * con el index de la fase actual
   *
   * @param faseActual index de la fase actual
   * @returns `boolean` true si está completada, false si no
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isCompleted(faseActual: number): boolean {
    return this.index < faseActual;
  }

  /**
   * Comprueba si una fase del formulario es la actual
   *
   * @param faseActual index de la fase actual
   * @returns `boolean` true si coinciden, false si no
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isActual(faseActual: number): boolean {
    return this.index === faseActual;
  }

  /**
   * Devuelve una cadena de texto según el estado de la fase del formulario
   * que sirve para establecer la clase en el elemento del breadcrumb correspondiente
   *
   * @param faseActual index de la fase actual
   * @returns `string` clase del elemento del breadcrumb según su estado
   */
  public getClass(faseActual: number): string {
    let clase: string = 'item';
    if (this.isActual(faseActual)) {
      clase += ' active';
    } else if (this.isCompleted(faseActual)) {
      clase += ' completed';
    }
    return clase;
  }

  //#endregion
  /***********************************************************************/
}
