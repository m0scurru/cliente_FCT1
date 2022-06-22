import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CuestionarioTutorEmpresaModel } from 'src/app/models/cuestionarios/cuestionarios-tutor-empresa.model';
import { HttpHeadersService } from '../http-headers.service';

const API_STORAGE_URL = `${environment.apiUrlCuestionario}`;

const obtenerCuestionariosURL = environment.apiUrl+environment.obtenerCuestionariosFCTURL;


@Injectable({
  providedIn: 'root'
})
export class TutorEmpresaService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient, private headersService: HttpHeadersService) {
    this.headers = headersService.getHeadersWithToken();
  }

  /**
   * Obtiene los cuestionarios disponibles para el tutor empresa en función del dni del usuario tutor empresa.
   * @params dni.
   * @return cuestionarios array de cuestionarios.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  getCuestionarios(dni:string | undefined): Observable<any> {
    const headers = this.headers;
    return this.http.get<Array<CuestionarioTutorEmpresaModel>>(`${obtenerCuestionariosURL}/${dni}`,{headers}).pipe(
      map((cuestionarios: Array<CuestionarioTutorEmpresaModel>) => {
        cuestionarios = <Array<CuestionarioTutorEmpresaModel>>cuestionarios.map((cuestionario: CuestionarioTutorEmpresaModel) => {
          return cuestionario
        });
        return cuestionarios || [];
      })
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
}
