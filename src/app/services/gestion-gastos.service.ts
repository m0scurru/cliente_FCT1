import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginStorageUserService } from './login.storageUser.service';
import { alumnoResponse } from '../models/alumnoResponse';
import { Alumno } from '../models/alumno';
import { environment } from 'src/environments/environment';
import { FacturaTransporte } from '../models/facturaTransporte';
import { facturaTransporteResponse } from '../models/facturaTransporteResponse';
import { HttpHeadersService } from './http-headers.service';
import { Gasto } from '../models/gasto';
import { GastoProfesor } from '../models/gastoProfesor';
import { gastoResponse } from '../models/gastoResponse';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { FacturaManutencion } from '../models/facturaManutencion';
import { gastoProfesorResponse } from '../models/gastoProfesorResponse';

@Injectable({ providedIn: 'root' })
export class GestionGastosService {
  @Output() gastoTrigger: EventEmitter<any> = new EventEmitter();
  public gastoBS = new BehaviorSubject<Gasto>(new Gasto());

  @Output() facturaTransporteTrigger: EventEmitter<any> = new EventEmitter();
  public facturaTransporteBS = new BehaviorSubject<FacturaTransporte>(
    new FacturaTransporte()
  );

  @Output() facturaManutencionTrigger: EventEmitter<any> = new EventEmitter();
  public facturaManutencionBS = new BehaviorSubject<FacturaTransporte>(
    new FacturaTransporte()
  );

  private urlBase: string = environment.apiUrl;
  private urlGestionGastosAlumno: string = 'gestionGastosAlumno/';
  private urlActualizarDatosGastoAlumno: string = 'actualizarDatosGastoAlumno/';
  private urlActualizarDiasVehiculoPrivado: string =
    'actualizarDiasVehiculoPrivado/';
  private urlActualizarFacturaTransporte: string =
    'actualizarFacturaTransporte/';
  private urlNuevaFacturaTransporte: string = 'nuevaFacturaTransporte/';
  private urlActualizarFacturaManutencion: string =
    'actualizarFacturaManutencion/';
  private urlNuevaFacturaManutencion: string = 'nuevaFacturaManutencion/';
  private urlEliminarFacturaTransporte: string = 'eliminarFacturaTransporte/';
  private urlEliminarFacturaManutencion: string = 'eliminarFacturaManutencion/';
  private urlGestionGastosProfesor: string = 'gestionGastosProfesor/';
  private urlEliminarAlumnoDeGastos: string = 'eliminarAlumnoDeGastos/';
  private urlNuevoAlumnoGestionGastos: string = 'nuevoAlumnoGestionGastos/';
  private urlDescargarAnexoVI: string = 'descargarAnexoVI/';

  public headers: HttpHeaders;

  constructor(private http: HttpClient, headersService: HttpHeadersService) {
    this.headers = headersService.getHeadersWithToken();
  }

  /***********************************************************************/
  //#region Gesti??n de gastos de alumnos - CRUD

  /***********************************************************************/
  //#region CRUD - Create

  /**
   * Realiza la petici??n para crear una nueva factura de transporte
   * @param factura Factura de transporte a enviar
   * @returns `Observable` de la respuesta del servidor
   * @author David S??nchez Barrag??n
   */
  public nuevaFacturaTransporte(factura: FacturaTransporte) {
    let url = this.urlBase + this.urlNuevaFacturaTransporte;
    const headers = this.headers;

    return this.http.post(url, factura, { headers });
  }

  /**
   * Realiza la petici??n para crear una nueva factura de manutenci??n
   * @param factura Factura de manutenci??n a enviar
   * @returns `Observable` de la respuesta del servidor
   * @author David S??nchez Barrag??n
   */
  public nuevaFacturaManutencion(factura: FacturaManutencion) {
    let url = this.urlBase + this.urlNuevaFacturaManutencion;
    const headers = this.headers;

    return this.http.post(url, factura, { headers });
  }

  /**
   * Env??a al servidor los gastos para confirmarlos en la Base de Datos
   * y generar el Anexo V
   *
   * @param gasto Objeto con los datos de los gastos del alumno
   * @returns `Observable` de la respuesta del servidor
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public confirmarGastos(gasto: Gasto): Observable<any> {
    let url = this.urlBase + 'confirmar_gastos';
    let headers = this.headers;

    return this.http.post(url, gasto, { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region CRUD - Read

  /**
   * Realiza una petici??n al servidor y obtiene la informaci??n necesaria para cargar la pantalla inicial
   * @param dni DNI del alumno
   * @returns `Observable` de la `HttpResponse`.
   * @author David S??nchez Barrag??n
   */
  public obtenerGastosAlumno(dni: any) {
    let url = this.urlBase + this.urlGestionGastosAlumno + dni;
    const headers = this.headers;

    return this.http.get<Gasto>(url, { headers }).pipe(
      map((resp: gastoResponse) => {
        return Gasto.gastoJSON(resp);
      })
    );
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region CRUD - Update

  /**
   * Realiza la petici??n para actualizar la informaci??n de la tabla Gasto
   * @param gasto Objeto Gasto del alumno a actualizar
   * @returns `Observable` de la `HttpResponse`.
   * @author David S??nchez Barrag??n
   */
  public actualizarDatosGastoAlumno(gasto: Gasto) {
    let url = this.urlBase + this.urlActualizarDatosGastoAlumno;
    const headers = this.headers;

    return this.http.put(url, JSON.stringify(gasto), { headers });
  }

   /**
   * Realiza la petici??n para actualizar una factura de transporte
   * @param factura Factura de transporte a enviar
   * @returns `Observable` de la respuesta del servidor
   * @author David S??nchez Barrag??n
   */
  public actualizarFacturaTransporte(factura: FacturaTransporte) {
    let url = this.urlBase + this.urlActualizarFacturaTransporte;
    const headers = this.headers;

    return this.http.put(url, JSON.stringify(factura), { headers });
  }

  /**
   * Realiza la petici??n para actualizar una factura de manutenci??n
   * @param factura Factura de manutenci??n a enviar
   * @returns `Observable` de la respuesta del servidor
   * @author David S??nchez Barrag??n
   */
  public actualizarFacturaManutencion(factura: FacturaManutencion) {
    let url = this.urlBase + this.urlActualizarFacturaManutencion;
    const headers = this.headers;

    return this.http.put(url, JSON.stringify(factura), { headers });
  }

  /**
   * Realiza la petici??n para actualizar los d??as en los que el alumno ha viajado en veh??culo privado
   * @param gasto Objeto Gasto del que actualizar los d??as de viaje en veh??culo privado
   * @returns `Observavle` de la `HttpResponse`
   * @author David S??nchez Barrag??n
   */
  public actualizarDiasVehiculoPrivado(gasto: Gasto) {
    let datos = {
      dni_alumno: gasto.dni_alumno,
      curso_academico: gasto.curso_academico,
      dias_transporte_privado: gasto.dias_transporte_privado,
    };
    const url: string = this.urlBase + this.urlActualizarDiasVehiculoPrivado;
    const headers = this.headers;

    return this.http.put(url, JSON.stringify(datos), { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region CRUD - Delete

  /**
   * Realiza la petici??n para eliminar una factura de manutenci??n
   * @param factura Factura de manutenci??n a enviar
   * @returns `Observable` de la respuesta del servidor
   * @author David S??nchez Barrag??n
   */
  public eliminarFacturaManutencion(id: number) {
    let url = this.urlBase + this.urlEliminarFacturaManutencion + id;
    const headers = this.headers;

    return this.http.delete<any>(url, { headers }).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  /**
   * Realiza la petici??n para eliminar una factura de transporte
   * @param factura Factura de transporte a enviar
   * @returns `Observable` de la respuesta del servidor
   * @author David S??nchez Barrag??n
   */
  public eliminarFacturaTransporte(id: number) {
    let url = this.urlBase + this.urlEliminarFacturaTransporte + id;
    const headers = this.headers;

    return this.http.delete<any>(url, { headers }).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares

  /**
   * Establece al Behaviour Subject el gasto
   * @param gasto Gasto del alumno
   * @author David S??nchez Barrag??n
   */
  public setGastoBS(gasto: Gasto) {
    this.gastoBS.next(gasto);
  }

  /**
   * Realiza la petici??n para obtener el Anexo VI del grupo del tutor que ha iniciado sesi??n en la aplicaci??n
   * @returns `Observable` de la petici??n HTTP
   * @author David S??nchez Barrag??n
   */
  public descargarAnexoVI() {
    let url = this.urlBase + this.urlDescargarAnexoVI;
    const headers = this.headers;

    return this.http.get(url, { headers: headers, responseType: 'blob' });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gesti??n de gastos de profesores - CRUD

  //#region CRUD - Read

  /**
   * Realiza una petici??n al servidor y obtiene la informaci??n necesaria para cargar la pantalla inicial para el profesor
   * @returns `Observable` de la `HttpResponse`.
   * @author David S??nchez Barrag??n
   */
  public obtenerGastosProfesor() {
    let url = this.urlBase + this.urlGestionGastosProfesor;
    const headers = this.headers;

    return this.http.get<GastoProfesor>(url, { headers }).pipe(
      map((resp: gastoProfesorResponse) => {
        return GastoProfesor.gastoProfesorJSON(resp);
      })
    );
  }

  //#endregion

  //#region CRUD - Delete

  /**
   * Realiza una petici??n al servidor y obtiene la informaci??n necesaria para cargar la pantalla inicial para el profesor
   * @returns `Observable` de la `HttpResponse`.
   * @author David S??nchez Barrag??n
   */
  public eliminarAlumnoDeGastos(dni: string) {
    let url = this.urlBase + this.urlEliminarAlumnoDeGastos + dni;
    const headers = this.headers;

    return this.http.delete<any>(url, { headers }).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  //#endregion

  //#region CRUD - Create

  /**
   * Realiza una petici??n al servidor para insertar un nuevo alumno en la gesti??n de gastos
   * @returns `Observable` de la `HttpResponse`.
   * @author David S??nchez Barrag??n
   */
  public nuevoAlumnoGestionGastos(alumno: Alumno) {
    let url = this.urlBase + this.urlNuevoAlumnoGestionGastos;
    const headers = this.headers;

    return this.http.post(url, alumno, { headers });
  }

  /**
   * Realiza una petici??n al servidor para generar el Anexo VII con los trayectos de los alumnos
   *
   * @param gastos `Gasto[]` datos de los gastos de los alumnos
   * @returns `Observable` de la `HttpResponse`
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public confirmarTrayectos(gastos: Gasto[]) {
    let url = this.urlBase + 'confirmar_trayectos';
    let headers = this.headers;

    return this.http.post(url, { gastos: gastos }, { headers });
  }

  //#endregion

  //#endregion
  /***********************************************************************/
}
