import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Alumno } from '../models/alumno';
import { Empresa } from '../models/empresa';
import { environment } from 'src/environments/environment';
import { HttpHeadersService } from './http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class AsociarAlumnoEmpresaService {
  public ruta: string = `${environment.apiUrl}`;
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private headersService: HttpHeadersService) {
    this.headers = headersService.getHeadersWithToken();
  }

  /***********************************************************************/
  //#region Asignación de alumnos a empresas

  /**
   * Solicita la lista de alumnos sin asociar a ninguna empresa
   *
   * @param dniTutor DNI del tutor loggeado
   * @returns Un observable con un vector de alumnos no asociados a empresas
   * @author Álvaro
   */
  public solicitarAlumnos(dniTutor: string) {
    let url: string = this.ruta + 'solicitarAlumnosSinEmpresa/' + dniTutor;
    const headers = this.headers;

    return this.http.get<Alumno[]>(url, { headers });
  }

  /**
   * Solicita la lista de empresas asociadas al centro educativo
   *
   * @param dniTutor DNI del tutor loggeado
   * @returns Un observable con un vector de empresas asociadas al centro educativo
   * @author Álvaro
   */
  public solicitarEmpresas(dniTutor: string) {
    let url: string = this.ruta + 'solicitarEmpresasConAlumnos/' + dniTutor;
    const headers = this.headers;

    return this.http.get<Empresa[]>(url, { headers });
  }

    /**
   * Solicita la lista de anexos de FCT
   *
   * @param dniTutor DNI del tutor loggeado
   * @returns Un observable con un vector de anexos asociadas a las FCT
   * @author Laura <lauramorenoramos97@gmail.com>
   */
     public solicitarAnexosFct(dniTutor: string) {
      let url: string = this.ruta + 'solicitarAnexosFct/' + dniTutor;
      const headers = this.headers;

      return this.http.get(url, { headers });
    }


  /**
   * Solicita a la API el nombre del ciclo al que tutoriza el tutor loggeado
   * @param dniTutor DNI del tutor loggeado
   * @returns Un observable con el nombre del ciclo
   * @author Álvaro
   */
  public solicitarNombreCiclo(dniTutor: string) {
    let url: string = this.ruta + 'solicitarNombreCiclo/' + dniTutor;
    const headers = this.headers;

    return this.http.get(url, { headers });
  }

  /**
   * Registra en la API los cambios de la asignación de alumnos a empresas
   * @param datos estructura de empresas con los alumnos asociados
   * @returns Un observable con la respuesta del servidor
   * @author Álvaro
   */
  public asignarAlumnos(datos: object) {
    let url: string = this.ruta + 'actualizarEmpresaAsignadaAlumno';
    const headers = this.headers;

    return this.http.post(url, datos, { headers });
  }

  //#endregion
  /***********************************************************************/

  /**
   * Solicita a la API que genere los Anexos I que sean necesarios
   * correspondientes a la asignación de alumnos a empresas,
   * montando un archivo .zip en caso de que se generen varios anexos
   *
   * @param dni DNI del tutor loggeado
   * @returns Un observable con el .zip que contienen los Anexos I rellenos
   * @author Laura
   */
  public generarAnexo(dni: string) {
    let dato = { dni_tutor: dni };
    const url: string = this.ruta + 'relleno';
    const HTTPOptions = this.headersService.getHeadersWithTokenArrayBuffer();

    return this.http.post(url, dato, HTTPOptions);
  }
}
