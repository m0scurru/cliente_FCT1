import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FirmaAnexoModel } from '../models/firmaAnexo.model';
import { HttpHeadersService } from './http-headers.service';

const API_STORAGE_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class FirmaService {
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private headersService: HttpHeadersService
  ) {
    this.headers = headersService.getHeadersWithToken();
  }

  /**
   * Sube una imagen con la firma en el servidor
   * @param storage Objeto con la imagen de la firma
   * @returns Un observable con la respuesta del servidor
   * @author Pablo
   */
  add(storage: FirmaAnexoModel): Observable<any> {
    const headers = this.headers;

    return this.http.post(`${API_STORAGE_URL}`, storage, { headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Maneja un error de response HTTP y lo lanza
   * @param error Error de la response
   * @returns Un mensaje de error
   * @author Pablo
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
