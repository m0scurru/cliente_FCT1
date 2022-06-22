import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CuestionarioModel } from 'src/app/models/cuestionarios/cuestionario.model';
import { HttpHeadersService } from '../http-headers.service';

const API_STORAGE_URL = `${environment.apiUrlCuestionario}`;
const crearCuestionarioURL = API_STORAGE_URL+environment.crearCuestionario;
const editarCuestionarioURL = API_STORAGE_URL+environment.editarCuestionarioURL;
const obtenerCuestionarioURL = environment.apiUrl+environment.obtenerCuestionarioURL;
const obtenerCuestionarioFCTURL = environment.apiUrl+environment.obtenerCuestionarioFCTURL;
const obtenerCuestionarioEdicionURL = API_STORAGE_URL+environment.obtenerCuestionarioEdicionURL;
const obtenerCuestionariosURL = API_STORAGE_URL+environment.obtenerCuestionariosURL;
const eliminarCuestionarioURL = API_STORAGE_URL+environment.eliminarCuestionarioURL;
const activarCuestionarioURL = API_STORAGE_URL+environment.activarCuestionarioURL;
const desactivarCuestionarioURL = API_STORAGE_URL+environment.desactivarCuestionarioURL;
const descargarCuestionarioURL = API_STORAGE_URL+environment.descargarCuestionarioURL;
const descargarCuestionarioFCTURL = environment.apiUrl+environment.descargarCuestionarioFCTURL;

@Injectable({
  providedIn: 'root'
})

export class CuestionarioService {
  // constructor(private http: HttpClient,) { }
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private headersService: HttpHeadersService) {
    this.headers = headersService.getHeadersWithToken();
  }

  add(storage: CuestionarioModel): Observable<any> {
    const headers = this.headers;
    return this.http.post(`${crearCuestionarioURL}`, storage,{ headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    )
  }

  /**
   * Obtiene el cuestionario en función del destinatario y el código centro.
   * @params destinatario tipo destinatario.
   * @params codigo_centro codigo del centro.
   * @return cuestionario modelo cuestionario.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  getCuestionario(destinatario: string | null, codigo_centro: string|undefined|null ): Observable<any> {
    const headers = this.headers;
    return this.http.get<CuestionarioModel>(`${obtenerCuestionarioURL}/${destinatario}/${codigo_centro}`,{headers}).pipe(
      map((cuestionario: CuestionarioModel) => {
        return cuestionario || {};
      })
    )
  }

  /**
   * Obtiene el cuestionario en función del destinatario y el código centro.
   * @params destinatario tipo destinatario.
   * @params codigo_centro codigo del centro.
   * @return cuestionario modelo cuestionario.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  getCuestionarioFCT(destinatario: string | null, codigo_centro: string|undefined|null ): Observable<any> {
    const headers = this.headers;
    return this.http.get<CuestionarioModel>(`${obtenerCuestionarioFCTURL}/${destinatario}/${codigo_centro}`,{headers}).pipe(
      map((cuestionario: CuestionarioModel) => {
        return cuestionario || {};
      })
    )
  }

  /**
   * Obtiene el cuestionario en función del id.
   * @params id identificador del cuestionario.
   * @return cuestionario modelo cuestionario.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  getCuestionarioEdicion(id: string | null): Observable<any> {
    const headers = this.headers;
    return this.http.get<CuestionarioModel>(`${obtenerCuestionarioEdicionURL}/${id}`,{headers}).pipe(
      map((cuestionario: CuestionarioModel) => {
        return cuestionario || {};
      })
    )
  }

  /**
   * Obtiene los cuestionarios en función del código centro.
   * @params codigo_centro codigo del centro.
   * @return cuestionarios Array de modelo cuestionario.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  getCuestionarios(codigo_centro:string | undefined): Observable<any> {
    const headers = this.headers;
    return this.http.get<Array<CuestionarioModel>>(`${obtenerCuestionariosURL}/${codigo_centro}`,{headers}).pipe(
      map((cuestionarios: Array<CuestionarioModel>) => {
        cuestionarios = <Array<CuestionarioModel>>cuestionarios.map((cuestionario: CuestionarioModel) => {
          return cuestionario;
        });
        return cuestionarios || [];
      })
    )
  }


  /**
   * Elimina el cuestionario en función de su id.
   * @params id identificador del cuestionario.
   * @return llamada la http.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  eliminarCuestionario(id: number): Observable<void> {
    const headers = this.headers;
    return this.http.delete<void>(`${eliminarCuestionarioURL}/${id}`,{headers}).pipe()
  }


  /**
   * Actualiza el cuestionario en función de su id.
   * @params CuestionarioModel modelo cuestionario.
   * @return res respuesta de la llamada http.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  update(storage: CuestionarioModel): Observable<any> {
    const headers = this.headers;
    return this.http.post(`${editarCuestionarioURL}`, storage,{headers}).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    )
  }

  /**
   * Captura el mensaje del error.
   * @params error de la llamada.
   * @return devuelve el mensaje de error.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  /**
   * Se activa el cuestionario en función de su id_cuestionario, destinatario y código_centro.
   * @params id_cuestionario.
   * @params destinatario.
   * @params cod_centro.
   * @return devuelve la respuesta a llamada.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  activarCuestionario(id_cuestionario: number , destinatario: string, cod_centro: string): Observable<any> {
    const headers = this.headers;
    return this.http.post(`${activarCuestionarioURL}/${id_cuestionario}/${destinatario}/${cod_centro}`, null, {headers}).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    )
  }

  /**
   * Se desactiva el cuestionario en función de su id_cuestionario.
   * @params id_cuestionario.
   * @return devuelve la respuesta a llamada.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  desactivarCuestionario(id_cuestionario: number): Observable<any> {
    const headers = this.headers;
    return this.http.post(`${desactivarCuestionarioURL}/${id_cuestionario}`, null, {headers}).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    )
  }

  /**
   * Descarga cuestionario pdf em función de su id_cuestionario.
   * @params id_cuestionario.
   * @return devuelve la llamada a descargarCuestionariosURL.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  descargarCuestionario(id_cuestionario: number, tipo_usuario: string | undefined ): any {
    if (tipo_usuario == "tutor"){
      const headers = this.headers;
    return this.http.get(`${descargarCuestionarioFCTURL}/${id_cuestionario}`,{ headers, responseType: 'blob'});
    }else{
      const headers = this.headers;
      return this.http.get(`${descargarCuestionarioURL}/${id_cuestionario}`,{ headers, responseType: 'blob'});
    }

  }


}
