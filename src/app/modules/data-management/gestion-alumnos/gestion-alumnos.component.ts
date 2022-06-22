import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Alumno } from 'src/app/models/alumno';
import { CrudAlumnosService } from 'src/app/services/crud-alumnos.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { ModalAlumnoComponent } from '../modal-alumno/modal-alumno.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ModoEdicion } from 'src/app/models/modoEdicion';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ManualGestionAlumnosComponent } from '../../manuales/manual-gestion-alumnos/manual-gestion-alumnos.component';

@Component({
  selector: 'app-gestion-alumnos',
  templateUrl: './gestion-alumnos.component.html',
  styleUrls: ['./gestion-alumnos.component.scss'],
})
export class GestionAlumnosComponent
  implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })

  /***********************************************************************/
  //#region Inicialización de variables
  dtElement?: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();

  public listaAlumnos: Alumno[] = [];
  public modosEdicion: typeof ModoEdicion = ModoEdicion;

  constructor(
    private crudAlumnosService: CrudAlumnosService,
    private loginStorageUser: LoginStorageUserService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    $.extend(true, $.fn.dataTable.defaults, {
      language: { url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' },
    });
    this.cargarAlumnos();
    this.obtenerAlumnosDesdeModal();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de datatables

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.listaAlumnos);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  /**
   * Recarga la tabla eliminando la instancia de la DataTable
   * @author David Sánchez Barragán
   */
  rerender(): void {
    this.dtElement!.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor

  /***********************************************************************/
  //#region Obtención de información: alumnos

  /**
   * Envía una petición al servidor para cargar los alumnos de un grupo y los lista en la tabla
   * @author David Sánchez Barragán
   */
  cargarAlumnos() {
    this.crudAlumnosService
      .listarAlumnos(this.loginStorageUser.getUser()?.dni)
      .subscribe({
        next: (result) => {
          this.listaAlumnos = result;
          this.rerender();
          this.dtTrigger.next(this.listaAlumnos);
          $.fn.dataTable.ext.errMode = 'throw';
        },
        error: (error) => {
          this.toastr.error('No se han podido recuperar los datos', 'Error');
        },
      });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Eliminación

  /**
   * Elimina un alumno de la base de datos, previa confirmación
   * @param alumno Objeto con los datos del alumno
   * @author David Sánchez Barragán
   */
  borrarAlumno(alumno: Alumno) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar registro',
          message: `¿Está seguro de que quiere eliminar a este alumno?`,
        },
        width: '400px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.respuesta) {
          this.crudAlumnosService.borrarAlumno(alumno.dni).subscribe({
            next: (response: any) => {
              this.cargarAlumnos();
              this.toastr.success('Alumno borrado correctamente');
            },
            error: (error) => {
              this.toastr.error('Ha ocurrido un error al eliminar al alumno');
            },
          });
        }
      });
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Invocación de modales

  /**
   * Abre un modal para ver o editar a un alumno
   * @param alumno Objeto con los datos del alumno
   * @param modoEdicion 0 -> edición, 1 -> creación, 2 -> sólo lectura
   * @author David Sánchez Barragán
   */
  mostrarAlumno(alumno: Alumno, modoEdicion: ModoEdicion) {
    this.modal.open(ModalAlumnoComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    this.crudAlumnosService.alumnoTrigger.emit([alumno, modoEdicion]);
  }

  /**
   * Abre un modal para registrar a un alumno
   * @author David Sánchez Barragán
   */
  registrarAlumno() {
    this.modal.open(ModalAlumnoComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });

    let alumno = new Alumno('', '', 0);
    alumno.matricula_cod_centro = this.loginStorageUser.getUser()?.cod_centro;

    this.crudAlumnosService.alumnoTrigger.emit([
      alumno,
      this.modosEdicion.nuevo,
    ]);
  }

  /**
   * Actualiza los datos de alumnos respecto de las modificaciones en el modal
   * @author David Sánchez Barragán
   */
  public obtenerAlumnosDesdeModal() {
    this.crudAlumnosService.alumnosArray.subscribe((array) => {
      this.listaAlumnos = array;
      this.rerender();
      this.dtTrigger.next(this.listaAlumnos);
    });
  }

  /**
   * Abre un modal de ayuda
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public abrirAyuda(): void {
    this.modal.open(ManualGestionAlumnosComponent, { size: 'lg' });
  }

  //#endregion
  /***********************************************************************/
}
