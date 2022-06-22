import { Injectable } from '@angular/core';
import { profesorResponse } from '../models/profesores/profesorResponse';
import { profesorCreateResponse } from '../models/profesores/profesorCreateResponse';
import { ProfesorCreate } from '../models/profesores/profesorCreate';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeadersService } from './http-headers.service';

@Injectable({ providedIn: 'root' })
export class CrudProfesoresService {
  public ruta = environment.apiUrl;
  public profesoresArray = new BehaviorSubject<string>('');
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private headersService: HttpHeadersService) {
    this.headers = headersService.getHeadersWithToken();
  }

  /***********************************************************************/
  //#region Gestión de profesores - CRUD

  /***********************************************************************/
  //#region CRUD - Create

  /**
   * Esta función nos permite enviar un profesor al servidor y crearlo
   * @param usuario es el usuario que se va a crear
   * @returns Un observable con la respuesta del servidor
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public registrarProfesor(usuario: ProfesorCreate) {
    let url: string = this.ruta + 'addProfesor';
    const headers = this.headers;

    return this.http
      .post<profesorCreateResponse>(url, usuario, { headers })
      .pipe(
        map((resp: ProfesorCreate) => {
          return ProfesorCreate.userJSON(usuario);
        })
      );
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region CRUD - Read

  /**
   * Esta función nos trae del servidor los profesores del centro de estudios correspondiente
   * gracias al dni del director o jefe de estudios que esta consultando este crud
   * @param dni_profesor es el dni del profesor que realiza la solicitud
   * @returns Un observable con un vector de profesores
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public getProfesores(dni_profesor: string) {
    let url: string = this.ruta + 'listarProfesores/' + dni_profesor;
    const headers = this.headers;

    return this.http.get<profesorResponse>(url, { headers });
  }

  /**
   * Esta función nos trae del servidor un profesor en concreto
   * @param dni_profesor es el dni del profesor que vamos a ver
   * @returns Un observable con un objeto de tipo profesor
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public getProfesor(dni_profesor: string) {
    let url: string = this.ruta + 'listarProfesor/' + dni_profesor;
    const headers = this.headers;

    return this.http.get<profesorResponse>(url, { headers });
  }

  /**
   * Esta función nos trae del servidor un profesor en concreto con unos parametros
   * en concreto para poder editarlo posteriormente
   * @param dni_profesor es el dni del profesor que se va a editar
   * @returns Un observable con un objeto de tipo profesor
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public getProfesorEdit(dni_profesor: string) {
    let url: string = this.ruta + 'listarProfesorEditar/' + dni_profesor;
    const headers = this.headers;

    return this.http.get<profesorCreateResponse>(url, { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region CRUD - Update

  /**
   * Esta función nos permite enviar un profesor al servidor y editarlo
   * @param usuario es el usuario que se va a editar
   * @returns Un observable con la respuesta del servidor
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public editarUser(usuario: ProfesorCreate) {
    let url: string = this.ruta + 'modificarProfesor';
    const headers = this.headers;

    return this.http
      .post<profesorCreateResponse>(url, usuario, { headers })
      .pipe(
        map((resp: ProfesorCreate) => {
          return ProfesorCreate.userJSON(usuario);
        })
      );
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region CRUD - Delete

  /**
   * Esta funcion envia el dni del profesor que vamos a eliminar a el servidor y lo
   * elimina
   * @param dni_profesor es el dni del profesor que se va a eliminar
   * @returns Un observable con la respuesta del servidor
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public eliminarProfesor(dni_profesor: string) {
    let url: string = this.ruta + 'eliminarProfesor/' + dni_profesor;
    const headers = this.headers;

    return this.http.delete(url, { headers });
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares

  /**
   * Esta funcion recoge el nuevo array de profesores en una variable
   * @param arrayProfesores
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public getProfesoresInArray(arrayProfesores: string) {
    this.profesoresArray.next(arrayProfesores);
  }

  //#endregion
  /***********************************************************************/
}
