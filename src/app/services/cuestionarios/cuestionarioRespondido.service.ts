import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CuestionarioRespondidoModel } from 'src/app/models/cuestionarios/cuestionarioRespondido.model';
import { CuestionariosRespondidosMediasModel } from 'src/app/models/cuestionarios/cuestionariosRespondidosMedias.model';
import { CursoAcademicoModel } from 'src/app/models/cuestionarios/cursoAcademico.model';
import { HttpHeadersService } from '../http-headers.service';

const API_STORAGE_URL = `${environment.apiUrlCuestionario}`;
const contestarCuestionarioURL = environment.apiUrl+environment.contestarCuestionario;
const contestarCuestionarioFCT = environment.apiUrl+environment.contestarCuestionarioFCT;
const verificarCuestionarioRespondidoURL = environment.apiUrl+environment.verificarCuestionarioRespondidoURL;
const verificarCuestionarioRespondidoFCTURL = environment.apiUrl+environment.verificarCuestionarioRespondidoFCTURL;
const obtenerMediasCuestionariosRespondidosURL = API_STORAGE_URL+environment.obtenerMediasCuestionariosRespondidosURL;
const obtenerMediasCuestionariosRespondidosFCTURL = environment.apiUrl+environment.obtenerMediasCuestionariosRespondidosFCTURL;
const obtenerCursosAcademicosURL = environment.apiUrl+environment.obtenerCursosAcademicosURL;
const listarCuestionariosRespondidosURL = API_STORAGE_URL+environment.listarCuestionariosRespondidosURL;
const listarCuestionariosRespondidosFCTURL = environment.apiUrl+environment.listarCuestionariosRespondidosFCTURL;
//falta la url del servidor en las variables de entorno

@Injectable({
  providedIn: 'root'
})
export class CuestionarioRespondidoService {

  // constructor(private http: HttpClient,) { }
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private headersService: HttpHeadersService) {
    this.headers = headersService.getHeadersWithToken();
  }

  /**
 * Envía a la API el cuestionario respondido.
 * @params CuestionarioRespondidoModel.
 * @return devuelve la respuesta.
 * @author Pablo G. Galan <pablosiege@gmail.com>
 */
  public add(cuestionario: CuestionarioRespondidoModel, tipo_usuario: string | undefined): Observable<any> {
    const headers = this.headers;

    if(tipo_usuario=="alumno"){

      return this.http.post(`${contestarCuestionarioURL}`, cuestionario,{headers}).pipe(
        map((res) => {
          return res || {};
        }),
        catchError(this.handleError)
      )

    }else{

      return this.http.post(`${contestarCuestionarioFCT}`, cuestionario,{headers}).pipe(
        map((res) => {
          return res || {};
        }),
        catchError(this.handleError)
      )

    }

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
   * Comprueba si el cuestionario ya ha sido respondido por el usuario en función de su id_usuario.
   * @params id_usuario.
   * @return llamada HTTP.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  getData(id_usuario: string | undefined, tipo_usuario: string | undefined) {
    const headers = this.headers;
    if(tipo_usuario=="alumno"){
      return this.http.get(`${verificarCuestionarioRespondidoURL}/${id_usuario}`,{headers})
    }else{
      return this.http.get(`${verificarCuestionarioRespondidoFCTURL}/${id_usuario}`,{headers})
    }

 }

  /**
   * Realiza la petición de forma sincrona.
   * @params id_usuario.
   * @return llamada HTTP.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  getDataSynchronous(id_usuario: string | undefined, tipo_usuario: string | undefined):Promise<any>{
    const headers = this.headers;
    return this.getData(id_usuario, tipo_usuario).toPromise()
  }

  /**
   * Obtiene las medias de los campos de tipo rango de los cuestionarios respondidos filtrados por curso académico, destinatario y código centro.
   * @params curso_academico.
   * @params destinatario.
   * @params codigo_centro.
   * @params tipo_usuario: puede ser tutor del alumno en el centro o jefatura.
   * @return cuestionario.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  obtenerMediasCuestionariosRespondidos(curso_academico:string | undefined , destinatario: string | undefined, codigo_centro: string | undefined, tipo_usuario: string | undefined ): Observable<any> {
    const headers = this.headers;
    if (tipo_usuario == "tutor"){
      return this.http.get<Array<CuestionariosRespondidosMediasModel>>(`${obtenerMediasCuestionariosRespondidosFCTURL}?curso_academico=${curso_academico}&destinatario=${destinatario}&codigo_centro=${codigo_centro}`,{headers}).pipe(
        map((cuestionarios: Array<CuestionariosRespondidosMediasModel>) => {
          cuestionarios = <Array<CuestionariosRespondidosMediasModel>>cuestionarios.map((cuestionario: CuestionariosRespondidosMediasModel) => {
            return cuestionario
          });
          return cuestionarios || [];
        })
      )
    }else{
      return this.http.get<Array<CuestionariosRespondidosMediasModel>>(`${obtenerMediasCuestionariosRespondidosURL}?curso_academico=${curso_academico}&destinatario=${destinatario}&codigo_centro=${codigo_centro}`,{headers}).pipe(
        map((cuestionarios: Array<CuestionariosRespondidosMediasModel>) => {
          cuestionarios = <Array<CuestionariosRespondidosMediasModel>>cuestionarios.map((cuestionario: CuestionariosRespondidosMediasModel) => {
            return cuestionario
          });
          return cuestionarios || [];
        })
      )
    }

  }

  /**
   * Obtiene los cursos académicos disponibles en la API.
   * @return cursoAcademico array de cursos académicos.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  obtenerCursoAcademico(): Observable<any> {
    const headers = this.headers;
    return this.http.get<Array<CursoAcademicoModel>>(`${obtenerCursosAcademicosURL}`,{headers}).pipe(
      map((cursoAcademico: Array<CursoAcademicoModel>) => {
        cursoAcademico = <Array<CursoAcademicoModel>>cursoAcademico.map((cursoAcademico: CursoAcademicoModel) => {
          return cursoAcademico
        });
        return cursoAcademico || [];
      })
    )
  }

  /**
   * Obtiene los cuestionarios respondidos en función del curso académico, el destinatario y el código del centro.
   * @params curso_academico.
   * @params destinatario.
   * @params codigo_centro.
   * @params tipo_usuario: tutor o jefatura.
   * @return cuestionarios array de cuestionarios.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  obtenerCuestionariosRespondidos(curso_academico:string | undefined , destinatario: string | undefined, codigo_centro: string | undefined, tipo_usuario: string | undefined ): Observable<any> {
    const headers = this.headers;
    if (tipo_usuario == "tutor"){
      return this.http.get<Array<CuestionarioRespondidoModel>>(`${listarCuestionariosRespondidosFCTURL}?curso_academico=${curso_academico}&destinatario=${destinatario}&codigo_centro=${codigo_centro}`,{headers}).pipe(
        map((cuestionarios: Array<CuestionarioRespondidoModel>) => {
          cuestionarios = <Array<CuestionarioRespondidoModel>>cuestionarios.map((cuestionario: CuestionarioRespondidoModel) => {
            return cuestionario
          });
          return cuestionarios || [];
        })
      )
    }else{
      return this.http.get<Array<CuestionarioRespondidoModel>>(`${listarCuestionariosRespondidosURL}?curso_academico=${curso_academico}&destinatario=${destinatario}&codigo_centro=${codigo_centro}`,{headers}).pipe(
        map((cuestionarios: Array<CuestionarioRespondidoModel>) => {
          cuestionarios = <Array<CuestionarioRespondidoModel>>cuestionarios.map((cuestionario: CuestionarioRespondidoModel) => {
            return cuestionario
          });
          return cuestionarios || [];
        })
      )
    }

  }

}
