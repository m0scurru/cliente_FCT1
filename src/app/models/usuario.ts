import { CentroEstudios } from './centroEstudios';
import { usuarioResponse } from './usuarioRespose';

export class Usuario {
  static usuarioJSON(obj: usuarioResponse) {
    return new Usuario(
      obj['email'],
      obj['nombre'],
      obj['apellidos'],
      obj['dni'],
      obj['tipo'],
      obj['roles'],
      //DSB Cambio 10-03-2022: Añadido codigo de centro de estudios
      obj['cod_centro'],
      obj['cod_centro_estudios'],
      //DJC Cambio 28-05-2022: añadido objeto de centro de estudios
      obj['centro'],
      obj['cod_grupo'],
      obj['curso_academico']
    );
  }

  constructor(
    public email: string,
    public nombre: string,
    public apellidos: string,
    public dni: string,
    public tipo: string,
    public roles?: Array<any>,
    //DSB Cambio 10-03-2022: Añadido codigo de centro de estudios
    public cod_centro?: string,
    public cod_centro_estudios?: string,
    //DJC Cambio 28-05-2022: añadido objeto de centro de estudios
    public centro?: CentroEstudios,
    public cod_grupo?: string,
    public curso_academico?: string
  ) {}

  /***********************************************************************/
  //#region Comprobación de roles - docentes

  /**
   * Esta función devuelve true si el usuario es profesor
   * @returns boolean: true -> es profesor, false -> no lo es
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isProfesor(): boolean {
    return this.tipo === 'profesor';
  }

  /**
   * Esta función devuelve true si el usuario es profesor y director
   * @returns boolean: true -> es director, false -> no lo es
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isDirector(): boolean {
    return (
      this.tipo === 'profesor' &&
      this.roles!.find((rol) => rol.id_rol === 1) != undefined
    );
  }

  /**
   * Esta función devuelve true si el usuario es profesor y de jefatura
   * @returns boolean: true -> es jefe de estudios, false -> no lo es
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isJefatura(): boolean {
    return (
      this.tipo === 'profesor' &&
      this.roles!.find((rol) => rol.id_rol === 2) != undefined
    );
  }

  /**
   * Esta función devuelve true si el usuario es profesor y tutor
   * @returns boolean: true -> es tutor, false -> no lo es
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isTutor(): boolean {
    return (
      this.tipo === 'profesor' &&
      this.roles?.find((rol) => rol.id_rol === 3) != undefined
    );
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Comprobación de roles - alumnos

  /**
   * Esta función devuelve true si el usuario es alumno
   * @returns boolean: true -> es alumno, false -> no lo es
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isAlumno(): boolean {
    return this.tipo === 'alumno';
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Comprobación de roles - trabajadores

  /**
   * Esta función devuelve true si el usuario es trabajador
   * @returns boolean: true -> es trabajador, false -> no lo es
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isTrabajador(): boolean {
    return this.tipo === 'trabajador';
  }

  /**
   * Esta función devuelve true si el usuario es trabajador y representante
   * @returns boolean: true -> es representante legal, false -> no lo es
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isRepresentante(): boolean {
    return (
      this.tipo === 'trabajador' &&
      this.roles!.find((rol) => rol.id_rol === 1) != undefined
    );
  }

  /**
   * Esta función devuelve true si el usuario es trabajador y responsable
   * @returns boolean: true -> es responsable, false -> no lo es
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isResponsable(): boolean {
    return (
      this.tipo === 'responsable' &&
      this.roles!.find((rol) => rol.id_rol === 2) != undefined
    );
  }

  /**
   * Esta función devuelve true si el usuario es trabajador y tutor
   * @returns boolean: true -> es tutor de empresas, false -> no lo es
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isTutorEmpresa(): boolean {
    return (
      // this.tipo === 'tutor' &&
      this.tipo === 'trabajador' &&
      this.roles?.find((rol) => rol.id_rol === 3) != undefined
    );
  }

  //#endregion
  /***********************************************************************/
}
