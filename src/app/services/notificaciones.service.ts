import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeadersService } from './http-headers.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  public ruta: string = environment.apiUrl;
  public jornadasArray = new BehaviorSubject<string>('');
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private headersService: HttpHeadersService
  ) {
    this.headers = headersService.getHeadersWithToken();
  }

  /**
   * Función que manda una petición al servidor para generar una notificación referente
   * al Anexo III una vez que se inicia la aplicación.
   * @param dni
   * @param email
   * @author Malena
   * @returns petición al servidor
   */
  public generarNotificaciones(dni:string,email:string){
    let url: string = this.ruta + 'generarNotificaciones';
    const headers = this.headers;
    let dato = { dni:dni, email: email };

    return this.http.post(url, dato, { headers });
  }

  /**
   * Función que recoge las notificaciones no leídas disponibles para el user
   * que inicia sesión.
   * @param dni
   * @param email
   * @returns petición al servior
   * @author Malena
   */
  public getNotificacionesHeader(dni:string,email:string){
    let url: string = this.ruta + 'getNotificacionesHeader';
    const headers = this.headers;
    let dato = { dni:dni, email: email };

    return this.http.post(url, dato, { headers });
  }

  /**
   * Función que realiza un count de las notificaciones no leídas del user
   * que inicia sesión, para mostrarlas en un icono de notificación en el header.
   * @param dni
   * @param email
   * @returns petición al servidor
   * @author Malena
   */
  public countNotificaciones(dni:string, email:string){
    let url: string = this.ruta + 'countNotificaciones';
    const headers = this.headers;
    let dato = { dni:dni, email: email };

    return this.http.post(url, dato, { headers });
  }

}
