import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FamiliaProfesional } from '../models/familiaProfesional';
import { FamiliaProfesionalResponse } from '../models/familiaProfesionalResponse';
import { Grupo } from '../models/grupo';
import { grupoResponse } from '../models/grupoResponse';

@Injectable({ providedIn: 'root' })
export class AuxService {
  @Output() alumnoTrigger: EventEmitter<any> = new EventEmitter();

  private urlBase: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /***********************************************************************/
  //#region Listado de provincias y ciudades

  /**
   * Obtiene un listado de provincias
   * @returns `Observable` de la `HttpResponse`.
   * @author David Sánchez Barragán
   */
  public listarProvincias() {
    let url = this.urlBase + 'listarProvincias';

    return this.http.get<string[]>(url).pipe(
      map((resp: string[]) => {
        return resp;
      })
    );
  }

  /**
   * Obtiene un listado de ciudades según una provincia
   * @param provincia Provincia de la que se quieren obtener las ciudades
   * @returns `Observable` de la `HttpResponse`.
   * @author David Sánchez Barragán
   */
  public listarCiudades(provincia: string) {
    let url = this.urlBase + 'listarCiudades/' + provincia;

    return this.http.get<string[]>(url).pipe(
      map((resp: string[]) => {
        return resp;
      })
    );
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Listado de ciclos formativos y familias profesionales

  /**
   * Obtiene un array con las familias profesionales del sistema
   *
   * @returns `Observable` del array de familias profesionales
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getFamilias(): Observable<FamiliaProfesional[]> {
    const url = this.urlBase + 'familias_profesionales';

    return this.http.get<FamiliaProfesional[]>(url).pipe(
      map((response: FamiliaProfesionalResponse[]) => {
        return response.map((familia) =>
          FamiliaProfesional.familiaProfesionalJSON(familia)
        );
      })
    );
  }

  /**
   * Obtiene un array de grupos, filtrados por familia profesional.
   * Si no se le pasa argumento, obtiene todos los grupos del sistema.
   *
   * @param familia `number|undefined` ID de la familia profesional
   * @returns `Observable` con el array de ciclos, filtrados por familia profesional
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getGrupos(familia?: number): Observable<Grupo[]> {
    const url = this.urlBase + 'ciclos/' + (familia ? familia : '');

    return this.http.get<Grupo[]>(url).pipe(
      map((response: grupoResponse[]) => {
        return response.map((grupo) => Grupo.grupoJSON(grupo));
      })
    );
  }

  //#endregion
  /***********************************************************************/
}
