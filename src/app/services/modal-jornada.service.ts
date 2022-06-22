import { Injectable, Output, EventEmitter } from '@angular/core';
import { Jornada } from '../models/Jornada/jornada';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeadersService } from './http-headers.service';

@Injectable({ providedIn: 'root' })
export class ModalJornadaService {
  public ruta: string = environment.apiUrl;
  public jornadasArray = new BehaviorSubject<string>('');
  private headers: HttpHeaders;

  @Output() jornadaTrigger: EventEmitter<Jornada> = new EventEmitter();

  constructor(private http: HttpClient, private headersService: HttpHeadersService) {
    this.headers = headersService.getHeadersWithToken();
  }

  /***********************************************************************/
  //#region Gestión de jornadas

  /**
   * Añade una jornada asociada a las prácticas de un alumno en una empresa
   * @param jornada Objeto con los datos de la jornada
   * @param dni DNI del alumno
   * @returns Un observable con la respuesta del servidor
   */
  public addJornada(jornada: Jornada, dni: string) {
    let url: string = this.ruta + 'addJornada';
    const headers = this.headers;
    let datos = {
      jornada: jornada,
      dni_alumno: dni,
    };

    return this.http.post(url, datos, { headers });
  }

  /**
   * Modifica una jornada asociada a las prácticas de un alumno en una empresa
   * @param jornada Objeto con los datos de la jornada
   * @param dni DNI del alumno
   * @returns Un observable con la respuesta del servidor
   */
  public updateJornada(jornada: Jornada, dni: string) {
    let url: string = this.ruta + 'updateJornada';
    const headers = this.headers;

    let datos = {
      jornada: jornada,
      dni_alumno: dni,
    };

    return this.http.post(url, datos, { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares

  /**
   * Función auxiliar que actualiza los datos de la tabla de seguimiento
   * @param arrayJornada Vector que contiene las jornadas asociadas a unas prácticas
   */
  public getJornadasInArray(arrayJornada: string) {
    this.jornadasArray.next(arrayJornada);
  }

  //#endregion
  /***********************************************************************/
}
