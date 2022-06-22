import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(public dialog: MatDialog) {}

  /**
   * Abre una ventana de diálogo de confirmación con título y mensaje personalizados,
   * devolviendo true o false según sea la respuesta afirmativa o negativa, respectivamente
   * @param title Título de la ventana de diálogo
   * @param message Mensaje de la ventana de diálogo
   * @returns true --> se ha pulsado 'Sí'; false --> se ha pulsado 'No'
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  async confirmacion(title: string, message: string) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title, message },
      width: '400px',
    });
    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe((res) => {
        resolve(res.respuesta);
      });
    })
      .then((respuesta) => {
        return respuesta;
      })
      .catch((err) => {
        return;
      });
  }
}
