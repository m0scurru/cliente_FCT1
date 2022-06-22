import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Anexo } from '../models/anexo';
import { anexoResponse } from '../models/anexoResponse';
import { anexoAlumnoResponse } from '../models/anexoAlumnoResponse';
import { tutoriaResponse } from '../models/tutoriaResponse';
import { environment } from 'src/environments/environment';
import { HttpHeadersService } from './http-headers.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnexoService {
  public ruta = environment.apiUrl;
  public headers: HttpHeaders;
  public anexosArray = new BehaviorSubject<string>('');
  constructor(
    private http: HttpClient,
    private headersService: HttpHeadersService
  ) {
    this.headers = headersService.getHeadersWithToken();
  }

  /***********************************************************************/
  //#region Gestión de anexos - CRUD

  /***********************************************************************/
  //#region CRUD - Read

  /**
   * @param dni_tutor Es el dni del tutor
   * @returns Observable con una lista de anexos, tanto del crud de anexos, como del historial
   * Este metodo hace una llamada a la api y listar los anexos
   * @author Pablo y Laura <lauramorenoramos97@gmail.com>
   */
  public getAnexos(dni_tutor: string, habilitado: number) {
    let url: string =
      this.ruta + 'listarAnexos/' + dni_tutor + '/' + habilitado;
    const headers = this.headers;

    return this.http.get<anexoResponse>(url, { headers });
  }

  /**
   * Esta funcion recoge el nuevo array de anexos en una variable
   * @param arrayAnexos
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public getAnexosInArray(arrayAnexos: string) {
    this.anexosArray.next(arrayAnexos);
  }

  /**
   * @param dni_tutor Es el dni del alumno
   * @returns Observable con una lista de anexos
   * Este metodo hace una llamada a la api y listar los anexos de los alumnos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public getAnexosAlumno(dni_alumno: string) {
    let url: string = this.ruta + 'listaAnexosAlumno/' + dni_alumno;
    const headers = this.headers;
    return this.http.get<anexoAlumnoResponse>(url, { headers });
  }

  /**
   *
   * @param dni_tutor es el dni del tutor
   */
  public getAnexosProgramaFormativo(dni_tutor: string) {
    const headers = this.headers;
    let url: string =
      this.ruta + 'solicitarAnexosProgramaFormativo/' + dni_tutor;
    return this.http.get<anexoAlumnoResponse>(url, { headers });
  }

  /**
   * Devuelve los grupos de un centro de estudios asociado al usuario loggeado
   * @param dni_tutor DNI del usuario loggeado
   * @returns Observable con una lista de grupos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public getGrupos(dni_tutor: string) {
    let url: string = this.ruta + 'listarGrupos/' + dni_tutor;
    const headers = this.headers;

    return this.http.get<tutoriaResponse>(url, { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region CRUD - Delete

  /**
   * Este metodo hace una llamada a la api y elimina un anexo
   * @author Laura <lauramorenoramos97@gmail.com>
   * @param dni_tutor  Es el dni del tutor
   * @param cod_anexo  Es el nombre del anexo que se va a eliminar
   * @returns Un observable con la respuesta del servidor
   */
  public eliminarAnexo(dni_tutor: string, cod_anexo: string) {
    cod_anexo = cod_anexo.replace('/', '*');
    cod_anexo = cod_anexo.replace('/', '*');

    let url: string =
      this.ruta + 'eliminarAnexo/' + dni_tutor + '/' + cod_anexo;
    const headers = this.headers;

    return this.http.delete<anexoResponse>(url, { headers });
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Descarga de anexos

  /**
   * @author Pablo
   * @param dni_tutor Es el dni del tutor
   * @param codigo Es el nombre del anexo que se va a descargar
   * @returns
   * Este metodo hace una llamada a la api y descargar un anexo en concreto
   */
  public descargarAnexo(dni_tutor: string, codigo: string) {
    let dato = { dni_tutor: dni_tutor, codigo: codigo };
    const url: string = this.ruta + 'descargarAnexo';
    const HTTPOptions = this.headersService.getHeadersWithTokenArrayBuffer();

    return this.http.post(url, dato, HTTPOptions);
  }

  /**
   * Este metodo hace una llamada a la api y descargar todos los anexos de un crud, si
   * habilitado es 0, este descarga el historial de anexos y si es 1 , descarga el crud
   * @author Pablo
   * @param dni_tutor Es el dni del tutor
   * @returns Un observable con la respuesta de descarga del servidor
   */
  public descargarTodo(dni_tutor: string, habilitado:number) {
    let dato = { dni_tutor: dni_tutor, habilitado: habilitado };
    const url: string = this.ruta + 'descargarTodo';
    const HTTPOptions = this.headersService.getHeadersWithTokenArrayBuffer();

    return this.http.post(url, dato, HTTPOptions);
  }

  /**
   * Este metodo hace una llamada a la api y descargar un anexo en concreto
   * @param dni_tutor Es el dni del tutor
   * @returns Un observable con la respuesta de descarga del servidor
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public descargarTodoAlumnos(dni_alumno: string) {
    let dato = { dni_alumno: dni_alumno };
    const url: string = this.ruta + 'descargarTodoAlumnos';
    const HTTPOptions = this.headersService.getHeadersWithTokenArrayBuffer();

    return this.http.post(url, dato, HTTPOptions);
  }


  /**
   * Envía una señal al servidor para descargar un anexo
   *
   * @param ruta Ruta del servidor donde se aloja el anexo
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public descargarAnexoRuta(ruta: string) {
    let url: string = this.ruta + 'descargar_anexo_ruta';
    let HTTPOptions = this.headersService.getHeadersWithTokenArrayBuffer();

    return this.http.post(url, { ruta: ruta }, HTTPOptions);
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Habilitar y deshabilitar anexos

  /**
   * Hace una llamada a la API para deshabilitar un anexo
   * @param cod_anexo Código del anexo a deshabilitar
   * @returns Un observable con la respuesta del servidor
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public deshabilitarAnexo(cod_anexo: string) {
    cod_anexo = cod_anexo.replace('/', '*');
    cod_anexo = cod_anexo.replace('/', '*');
    let url: string = this.ruta + 'deshabilitarAnexo';
    let dato = { cod_anexo: cod_anexo };
    const headers = this.headers;

    return this.http.post<anexoResponse>(url, dato, { headers });
  }

  /**
   * Hace una llamada a la API para habilitar un anexo
   * @param cod_anexo Código del anexo a deshabilitar
   * @returns Un observable con la respuesta del servidor
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public habilitarAnexo(dni_tutor: string, cod_anexo: string) {
    cod_anexo = cod_anexo.replace('/', '*');
    cod_anexo = cod_anexo.replace('/', '*');
    let dato = { cod_anexo: cod_anexo, dni_tutor: dni_tutor };
    let url: string = this.ruta + 'habilitarAnexo';
    const headers = this.headers;

    return this.http.post<anexoResponse>(url, dato, { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Rellenar Anexos

  /**
   * Esta funcion te permite rellenar el anexo XV
   * @param dni_alumno es el dni del alumno
   * @param cod_anexo  es el nombre completo del archivo a rellenar
   * @returns
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public rellenarAnexoXV(dni_alumno: string, cod_anexo: string) {
    cod_anexo = cod_anexo.replace('/', '*');
    cod_anexo = cod_anexo.replace('/', '*');

    let url: string = this.ruta + 'rellenarAnexoXV';
    let dato = { cod_anexo: cod_anexo, dni: dni_alumno };
    const HTTPOptions = this.headersService.getHeadersWithTokenArrayBuffer();

    return this.http.post(url, dato, HTTPOptions);
  }

  /**
 *Esta funcion permite, segun si se selecciona el anexo 2 o 4, que se rellene
  dicho anexo y que se descargue para el usuario
 * @param tipo_anexo es el tipo de anexo que se va a rellenar
 * @param dni_tutor es el dni del tutor que hace la petición
 * @author Laura <lauramorenoramos97@gmail.com>
 */
  public rellenarAnexoIIyIV(tipo_anexo: string, dni_tutor: string) {
    let url: string = this.ruta + 'rellenarAnexoIIYIV';
    let dato = { anexo: tipo_anexo, dni_tutor: dni_tutor };
    const HTTPOptions = this.headersService.getHeadersWithTokenArrayBuffer();

    return this.http.post(url, dato, HTTPOptions);
  }
  //#endregion
  /***********************************************************************/
}
