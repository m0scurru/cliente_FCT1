import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatesService {
  constructor(public datePipe: DatePipe) {}

  /**
   * Devuelve la fecha de hoy en string
   *
   * @returns `string` fecha de hoy en formato 'yyyy-mm-dd'
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  get now(): string {
    return this.dateToString(new Date());
  }

  /**
   * Calcula la fecha de final del convenio, sumando cuatro años a la fecha que se le pase
   *
   * @param fecha `Date | string` Fecha de partida
   * @returns `Date` Fecha con cuatro años sumados
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public calcFechaFin(fecha: Date | string): Date {
    if (fecha instanceof Date) {
      return new Date(
        fecha.getFullYear() + 4,
        fecha.getMonth(),
        fecha.getDate()
      );
    } else {
      let aux: Date = this.stringToDate(fecha);
      return new Date(aux.getFullYear() + 4, aux.getMonth(), aux.getDate());
    }
  }

  /**
   * Convierte una fecha `Date` en un `string` con formato 'yyyy-MM-dd'
   *
   * @param fecha `Date`
   * @returns `string` Fecha en formato 'yyyy-MM-dd'
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public dateToString(fecha: Date): string {
    return this.datePipe.transform(fecha, 'yyyy-MM-dd')!;
  }

  /**
   * Convierte una fecha `string` en formato 'yyyy-MM-dd' en `Date`
   *
   * @param fecha `string` Fecha con formato 'yyyy-MM-dd'
   * @returns `Date`
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public stringToDate(fecha: string): Date {
    return new Date(Date.parse(fecha));
  }
}
