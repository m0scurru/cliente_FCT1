import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginStorageUserService } from './login.storageUser.service';

@Injectable({
  providedIn: 'root',
})
export class HttpHeadersService {
  constructor(private storage: LoginStorageUserService) {}

  /***********************************************************************/
  //#region Headers sin token

  /**
   * Construye y devuelve unos headers sólo con el Content-Type (application/json)
   *
   * @returns `HttpHeaders` Headers sólo con el Content-Type
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getHeadersWithoutToken() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: '*/*',
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Headers con token

  /**
   * Construye y devuelve unos headers con el token incrustado
   *
   * @returns `HttpHeaders` Headers con el token incrustado
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getHeadersWithToken() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.storage.getTokenFromSession(),
      Accept: '*/*',
    });
  }

  /**
   * Construye un objeto que contiene los headers y el responseType a 'arraybuffer'
   * para enviar una señal de descarga
   *
   * @returns Objeto con los headers y el tipo de respuesta arraybuffer
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getHeadersWithTokenArrayBuffer() {
    const headers = this.getHeadersWithToken();
    const HTTPOptions: any = {
      headers,
      responseType: 'arraybuffer',
    };
    return HTTPOptions;
  }

  //#endregion
  /***********************************************************************/
}
