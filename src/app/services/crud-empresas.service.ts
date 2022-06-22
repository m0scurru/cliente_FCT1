import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Empresa } from '../models/empresa';
import { EmpresaResponse } from '../models/empresaResponse';
import { Trabajador } from '../models/trabajador';
import { TrabajadorResponse } from '../models/trabajadorResponse';
import { environment } from 'src/environments/environment';
import { HttpHeadersService } from './http-headers.service';
import { CentroEstudios } from '../models/centroEstudios';
import { CentroEstudiosResponse } from '../models/centroEstudiosResponse';

@Injectable({ providedIn: 'root' })
export class CrudEmpresasService {
  @Output() empresaTrigger: EventEmitter<any> = new EventEmitter();
  public empresaBS = new BehaviorSubject<any>('');
  public URLAPI: string = environment.apiUrl;
  public empresasArray = new BehaviorSubject<Empresa[]>([]);
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private headersService: HttpHeadersService
  ) {
    this.headers = headersService.getHeadersWithToken();
  }

  /***********************************************************************/
  //#region Gestión de empresas - CRUD

  /***********************************************************************/
  //#region CRUD - Read

  /**
   * Devuelve una lista de empresas.
   * Si se pasa el DNI del profesor como parámetro, devuelve las asociadas mediante el centro de estudios
   * Si no, devuelve todas las empresas de la base de datos
   *
   * @param dniProfesor `string|undefined` el DNI del profesor logueado
   * @returns un observable del vector de empresas
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getEmpresas(dniProfesor: string): Observable<Empresa[]> {
    const url: string =
      this.URLAPI + 'solicitar_empresas/profesor=' + dniProfesor;
    const headers = this.headers;

    return this.http.get<EmpresaResponse[]>(url, { headers }).pipe(
      map((resp: EmpresaResponse[]) => {
        return resp.map((empresa) => Empresa.empresaJSON(empresa));
      })
    );
  }

  /**
   * Devuelve un observable con la información de la empresa
   *
   * @param cif CIF de la empresa
   * @returns `Observable` de tipo empresa
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getEmpresa(cif: string): Observable<Empresa> {
    let url: string = this.URLAPI + 'solicitar_empresa/cif=' + cif;
    let headers = this.headers;

    return this.http.get<EmpresaResponse>(url, { headers }).pipe(
      map((empresa: EmpresaResponse) => {
        return Empresa.empresaJSON(empresa);
      })
    );
  }
  /**
   * Devuelve un objeto con la información del representante de una empresa
   *
   * @param idEmpresa la ID de la empresa
   * @returns un observable del representante de la empresa
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getRepresentante(idEmpresa: string): Observable<Trabajador> {
    const url: string = this.URLAPI + 'solicitar_representante/id=' + idEmpresa;
    const headers = this.headers;

    return this.http.get<TrabajadorResponse>(url, { headers }).pipe(
      map((trabajador: TrabajadorResponse) => {
        return Trabajador.trabajadorJSON(trabajador);
      })
    );
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region CRUD - Update

  /**
   * Actualiza los datos de una empresa, devolviendo una respuesta del servidor
   *
   * @param empresa La empresa a actualizar
   * @returns Un observable de la respuesta del servidor: 200 -> Todo bien; 400 -> Error
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public updateEmpresa(empresa: Empresa) {
    const url: string = this.URLAPI + 'update_empresa';
    const headers = this.headers;

    return this.http.put(url, JSON.stringify(empresa), { headers });
  }

  /**
   * Actualiza los datos del representante legal de una empresa, devolviendo una respuesta del servidor
   *
   * @param representante los datos del representante legal
   * @returns Un observable de la respuesta del servidor: 200 -> OK, 400 -> Error
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public updateRepresentante(representante: Trabajador) {
    const url: string = this.URLAPI + 'update_trabajador';
    const headers = this.headers;

    return this.http.put(url, JSON.stringify(representante), { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region CRUD - Delete

  /**
   * Elimina una empresa de la base de datos
   *
   * @param idEmpresa el ID de la empresa a eliminar
   * @returns una respuesta del servidor: 200 -> OK, 400 -> Error
   */
  public deleteEmpresa(idEmpresa: string) {
    const url: string = this.URLAPI + 'delete_empresa/id=' + idEmpresa;
    const headers = this.headers;

    return this.http.delete(url, { headers });
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de convenios

  /**
   * Solicita al servidor la información del centro de estudios y su director
   *
   * @param convenio Código del convenio
   * @returns `Observable` del centro de estudios con la información del director
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getCentroEstudios(convenio: string): Observable<CentroEstudios> {
    let url: string =
      this.URLAPI + 'solicitar_centro_estudios/convenio=' + convenio;
    let headers = this.headers;

    return this.http.get<CentroEstudiosResponse>(url, { headers }).pipe(
      map((centro: CentroEstudiosResponse) => {
        return CentroEstudios.centroEstudiosJSON(centro);
      })
    );
  }

  /**
   * Envía al servidor los datos del convenio y los elementos a rellenar en el anexo o
   * el archivo del anexo en sí, según haya elegido el usuario
   *
   * @param datos objeto con datos del convenio y los datos a rellenar en el anexo o el archivo del anexo en sí
   * @returns `Observable` con la respuesta del servidor
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public addConvenio(datos: object): Observable<any> {
    let url: string = this.URLAPI + 'add_convenio';
    let headers = this.headers;

    return this.http.post(url, datos, { headers });
  }

  /**
   * Envía al servidor los datos del convenio a editar y los elementos a rellenar en el anexo o
   * el archivo del anexo en sí, según haya elegido el usuario
   *
   * @param datos objeto con datos del convenio y los datos a rellenar en el anexo o el archivo del anexo en sí
   * @returns `Observable` con la respuesta del servidor
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public editConvenio(datos: object): Observable<any> {
    let url: string = this.URLAPI + 'editar_convenio';
    let headers = this.headers;

    return this.http.put(url, datos, { headers });
  }

  /**
   * Envía al servidor los datos del convenio renovado y los elementos a rellenar en el anexo o
   * el archivo del anexo en sí, según haya elegido el usuario
   *
   * @param datos objeto con datos del convenio y los datos a rellenar en el anexo o el archivo del anexo en sí
   * @returns `Observable` con la respuesta del servidor
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public renovarConvenio(datos: object): Observable<any> {
    let url: string = this.URLAPI + 'renovar_convenio';
    let headers = this.headers;

    return this.http.post(url, datos, { headers });
  }

  /**
   * Envía al servidor una petición para eliminar un convenio, lo cual
   * deshabilita el anexo asociado
   *
   * @param cod Código del convenio a eliminar
   * @returns `Observable` con la respuesta del servidor
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public eliminarConvenio(cod: string): Observable<any> {
    let codAux = cod.replaceAll('/', '-');
    codAux = codAux.replaceAll('\\', '-');
    let url: string = `${this.URLAPI}eliminar_convenio/cod=${codAux}`;
    let headers = this.headers;

    return this.http.delete(url, { headers });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares

  /**
   * Función auxiliar datatables - Establece el array de empresas
   * @param empresasArray array de empresas
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getEmpresasArray(empresasArray: Empresa[]) {
    this.empresasArray.next(empresasArray);
  }

  //#endregion
  /***********************************************************************/
}
