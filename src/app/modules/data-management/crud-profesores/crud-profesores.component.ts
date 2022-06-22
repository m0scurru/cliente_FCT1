import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrudProfesoresService } from 'src/app/services/crud-profesores.service';
import { ModalProfesoresComponent } from '../modal-profesores/modal-profesores.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-crud-profesores',
  templateUrl: './crud-profesores.component.html',
  styleUrls: ['./crud-profesores.component.scss'],
})
export class CrudProfesoresComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild(DataTableDirective, { static: false })

  /***********************************************************************/
  //#region Inicialización de variables
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;

  profesores: any = [];
  profesor: any = [];
  usuario;
  dni?: string;
  respuesta: any = [];

  constructor(
    private profesoresService: CrudProfesoresService,
    private router: Router,
    private toastr: ToastrService,
    private modal: NgbModal,
    private storageUser: LoginStorageUserService,
    public dialogService: DialogService
  ) {
    this.usuario = storageUser.getUser();
    this.dni = this.usuario?.dni;
  }

  ngOnInit(): void {
    delete this.dtOptions['language'];
    this.verProfesores();
    this.getArrayProfesores();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de datatables

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.profesores);
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
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.profesores);
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor

  /***********************************************************************/
  //#region Obtención de información: profesores

  /**
   * Esta funcion recoge a los profesores del centro de estudios del director/jefe de estudios
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public verProfesores() {
    this.profesoresService.getProfesores(this.dni!).subscribe((response) => {
      this.profesores = response;
      //#region Datatable
      response = (this.profesores as any).data;
      // Calling the DT trigger to manually render the table
      this.rerender();
      this.dtTrigger.next(this.profesores);
      $.fn.dataTable.ext.errMode = 'throw';
    });
    $.extend(true, $.fn.dataTable.defaults, {
      language: { url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' },
      //#endregion
    });
  }

  /**
   * @author Laura <lauramorenoramos97@gmail.com>
   * Esta funcion es una suscripcion a una variable BehaviorSubject que recoge el nuevo
   * array de profesores que ha sido modificado por haber añadido un profesor,
   * modificado un profesor o eliminado un profesor desde los modales
   */
  public getArrayProfesores() {
    this.profesoresService.profesoresArray.subscribe((array) => {
      this.profesores = array;
      this.rerender();
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Eliminación

  /**
   * Esta funcion sirve para llamar al modal que nos va a permitir eliminar un profesor
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public async eliminarProfesor(dni_profesor: string) {
    let hacerlo = await this.dialogService.confirmacion(
      'Eiminar',
      `¿Está seguro de que desea eliminar este profesor?`
    );

    if (hacerlo) {
      this.profesoresService.eliminarProfesor(dni_profesor).subscribe({
        next: (res) => {
          this.toastr.success('Profesor Eliminado', 'Eliminado');
          this.verProfesores();
        },
        error: (e) => {
          this.toastr.error('El profesor no ha podido eliminarse', 'Fallo');
        },
      });
    }
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Invocación de modales: 0 -> ver, 1 -> crear, 2 -> editar

  /**
   * Esta funcion sirve para llamar al modal que nos va a permitir ver un profesor
   * @author Laura <lauramorenoramos97@gmail.com>
   */
   public verProfesor(dni_profesor: string) {
    sessionStorage.setItem('numPeticion', '0');
    sessionStorage.setItem('dniProfesor', dni_profesor);
    this.modal.open(ModalProfesoresComponent, { size: 'md' });
  }

  /**
   * Esta funcion sirve para llamar al modal que nos va a permitir registrar un profesor
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public registrarProfesor() {
    sessionStorage.setItem('numPeticion', '1');
    this.modal.open(ModalProfesoresComponent, { size: 'md' });
  }

  /**
   * Esta funcion sirve para llamar al modal que nos va a permitir modificar un profesor
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public modificarProfesor(dni_profesor: string) {
    sessionStorage.setItem('numPeticion', '2');
    sessionStorage.setItem('dniProfesor', dni_profesor);
    this.modal.open(ModalProfesoresComponent, { size: 'md' });
  }

  //#endregion
  /***********************************************************************/
}
