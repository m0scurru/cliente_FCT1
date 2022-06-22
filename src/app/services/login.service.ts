import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeadersService } from './http-headers.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  public ruta: string = environment.apiUrl;
  public headers: HttpHeaders;

  constructor(private http: HttpClient, private headersService: HttpHeadersService) {
    this.headers = headersService.getHeadersWithoutToken();
  }

  /**
   * Envía una petición de login al servidor
   *
   * @param datos Datos del login (usuario y password)
   * @returns Un observable con la respuesta del servidor
   * @author Álvaro
   */
  public login(datos: object) {
    let url: string = this.ruta + 'login';
    const headers = this.headers;

    return this.http.post(url, datos, { headers });
  }
}
