import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tutor } from '../models/tutor';
import { map, Observable } from 'rxjs';
import { tutorResponse } from '../models/tutorResponse';
import { environment } from 'src/environments/environment';
import { FileUploadModel } from '../models/file-upload.model';
import { LoginStorageUserService } from '../services/login.storageUser.service';
import { HttpHeadersService } from './http-headers.service';
import { Alumno } from '../models/alumno';

@Injectable({ providedIn: 'root' })
export class SeguimientoServiceService {
  public ruta: string = environment.apiUrl;
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    public loginStorageUser: LoginStorageUserService,
    private headersService: HttpHeadersService
  ) {
    this.headers = headersService.getHeadersWithToken();
  }

  /***********************************************************************/
  //#region Cabeceras: departamento, alumno, horas y tutor

  /***********************************************************************/
  //#region Gestión del departamento

  /**
   * Solicita al servidor el nombre del departamento de las prácticas
   * @param dni DNI del alumno
   * @returns Observable con el nombre del departamento asignado (puede estar vacío)
   * @author Malena
   */
  public gestionarDepartamento(dni: string) {
    let url: string = this.ruta + 'gestionarDepartamento';
    const headers = this.headers;
    let dato = { dni: dni };

    return this.http.post(url, dato, { headers });
  }

  /**
   * Añade un departamento a unas prácticas FCT
   * @param dni DNI del alumno
   * @param departamento Nombre del departamento
   * @returns Observable con la respuesta del servidor
   * @author Malena
   */
  public addDepartamento(dni: string, departamento: string) {
    let url: string = this.ruta + 'addDepartamento';
    const headers = this.headers;

    let datos = {
      dni: dni,
      departamento: departamento,
    };

    return this.http.put(url, datos, { headers });
  }
  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión del tutor/responsable de empresa
  /**
   * Solicita al servidor los datos del tutor de empresa de las FCT
   * @param dni DNI del alumno
   * @returns Un observable con los datos del tutor de la empresa
   * @author Malena
   */
  public recogerTutorEmpresa(dni: string) {
    let url: string = this.ruta + 'recogerTutorEmpresa';
    const headers = this.headers;

    let dato = { dni: dni };

    return this.http.post(url, dato, { headers });
  }

  /**
   * Solicita al servidor los datos de los tutores y responsables de la empresa asociada a las FCT
   * @param id_empresa La ID de la empresa de las FCT
   * @returns Un observable con un vector de trabajadores (tutores y responsables)
   * @author Malena
   */
  public getTutoresResponsables(id_empresa: string): Observable<Tutor[]> {
    let url: string = this.ruta + 'getTutoresResponsables/id=' + id_empresa;
    const headers = this.headers;

    return this.http.get<tutorResponse[]>(url, { headers }).pipe(
      map((resp: tutorResponse[]) => {
        return resp.map((tutor) => Tutor.tutorJSON(tutor));
      })
    );
  }
  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión del tutor/responsable del centro estudios
  /**
   * Establece un trabajador de la empresa como tutor seleccionado
   * @param mail_tutor_nuevo DNI del tutor a establecer
   * @param dni_alumno DNI del alumno
   * @returns Un observable con la respuesta del servidor
   * @author Malena
   */
  public guardarTutorSeleccionado(mail_tutor_nuevo: string, dni_alumno: string) {
    let url: string = this.ruta + 'actualizarTutorEmpresa';
    const headers = this.headers;

    let dato = {
      mail_tutor_nuevo: mail_tutor_nuevo,
      dni_alumno: dni_alumno,
    };

    return this.http.put(url, dato, { headers });
  }

  /**
   * Función que recoge los alumnos de los que un profesor es tutor.
   * @author Malena
   * @returns petición al servidor
   */
  public getAlumnosAsociados(dni: string) {
    let url: string = this.ruta + 'getAlumnosAsociados';
    const headers = this.headers;
    let datos = { dni_tutor: dni, };
    return this.http.post(url, datos, { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión del alumno

  /**
   * Solicita al servidor el nombre y apellidos del alumno y el nombre de la empresa
   * @param dni DNI del alumno
   * @returns Observable con los datos del alumno (nombre y apellidos) y el nombre de la empresa
   * @author Malena
   */
  public escribirDatos(dni: string) {
    let url: string = this.ruta + 'devolverDatosAlumno';
    const headers = this.headers;

    let dato = { dni: dni };

    return this.http.post(url, dato, { headers });
  }

  /**
   * Solicita al servidor el sumatorio de las horas realizadas en las FCT
   * @param dni DNI del alumno
   * @returns Observable con el sumatorio de horas realizadas en las FCT
   * @author Malena
   */
  public sumatorioHorasTotales(dni: string) {
    let url: string = this.ruta + 'sumatorioHorasTotales';
    const headers = this.headers;

    let dato = { dni: dni };

    return this.http.post(url, dato, { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de jornadas

  /**
   * Solicita al servidor los datos de las jornadas de unas FCT
   * @param dni DNI del tutor
   * @returns Un observable con los datos de las jornadas
   * @author Malena
   */
  public devolverJornadas(dni: string) {
    let url: string = this.ruta + 'devolverJornadas';
    const headers = this.headers;

    let dato = { dni: dni };

    return this.http.post(url, dato, { headers });
  }

  /**
   * Función que solicita al servidor las jornadas ordenadas en semanas
   * @param dni
   * @returns petición al servidor
   * @author Malena
   */
  public devolverSemanas(dni: string) {
    let url: string = this.ruta + 'devolverSemanas';
    const headers = this.headers;
    let dato = { dni: dni };
    return this.http.post(url, dato, { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Generación del Anexo III

  /**
   * Envía al servidor una señal de descarga del Anexo III
   * @param dni DNI del tutor
   * @returns Un observable con la descarga del Anexo III
   * @author Malena
   */
  public generarDocumento(id_quinto_dia: string, dni: string) {
    let dato = { id_quinto_dia: id_quinto_dia, dni: dni };
    const url: string = this.ruta + 'generarAnexo3';
    const HTTPOptions = this.headersService.getHeadersWithTokenArrayBuffer();

    return this.http.post(url, dato, HTTPOptions);
  }

  //#endregion
  /***********************************************************************/


  /***********************************************************************/
  //#region Descarga del Anexo III
  /**
   * Función que comprueba en el servidor si existe un documento ya de una semana determinada
   * @param id_quinto_dia
   * @param id_fct
   * @returns petición al servidor
   * @author Malena
   */
  public hayDocumento(id_quinto_dia: number, id_fct: number) {
    let dato = { id_quinto_dia: id_quinto_dia, id_fct: id_fct };
    const url: string = this.ruta + 'hayDocumento';
    const headers = this.headers;
    return this.http.post(url, dato, { headers });
  }


  /**
   * Envía al servidor una señal de descarga del Anexo III
   * @param dni DNI del tutor
   * @returns Un observable con la descarga del Anexo III
   * @author Malena
   */
  public descargarPDF(ruta_hoja: string) {
    let dato = { ruta_hoja: ruta_hoja };
    const url: string = this.ruta + 'descargarAnexo3';
    const HTTPOptions = this.headersService.getHeadersWithTokenArrayBuffer();
    return this.http.post(url, dato, HTTPOptions);
  }

  //#endregion
  /***********************************************************************/


  /***********************************************************************/
  //#region Subir el documento pdf del Anexo III

  /**
   * Función que envía al servidor los datos necesarios para poder subir el documento
   * en formato PDF
   * @param storage
   * @returns petición al servidor
   * @author Malena
   */
  subirAnexo3(formData: FormData) {
    let dato = {
      dni: formData.get('dni'),
      file: formData.get('file'),
      file_name: formData.get('file_name'),
      id_fct: formData.get('id_fct'),
      id_quinto_dia: formData.get('id_quinto_dia'),
      firmado_tutor_empresa: formData.get('firmado_tutor_empresa')
    };
    const url: string = this.ruta + 'subirAnexo3';
    const headers = this.headers;
    return this.http.post(url, dato, { headers });
  }

  //#endregion
  /***********************************************************************/


}
