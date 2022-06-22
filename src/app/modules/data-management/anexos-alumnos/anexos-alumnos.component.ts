import {
   Component,
   OnDestroy,
   OnInit,
   ViewChild
  } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnexoService } from 'src/app/services/crud-anexos.service';
import * as FileSaver from 'file-saver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { Subject } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { DataTableDirective } from 'angular-datatables';
import { ModalTipoAnexoComponent } from '../modal-tipo-anexo/modal-tipo-anexo.component';
import { ModalUploadAnexoComponent } from '../modal-upload-anexo/modal-upload-anexo.component';
import { ManualCrudAnexosAlumnosComponent } from '../../manuales/manual-crud-anexos-alumnos/manual-crud-anexos-alumnos.component';

@Component({
  selector: 'app-anexos-alumnos',
  templateUrl: './anexos-alumnos.component.html',
  styleUrls: ['./anexos-alumnos.component.scss'],
})
export class AnexosAlumnosComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })

  /***********************************************************************/
  //#region Inicialización de variables
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;

  usuario;
  anexosArray: any = [];
  dni_alumno?: string;
  public evento: any = null;
  tipoAnexo: any;

  constructor(
    private anexoService: AnexoService,
    private router: Router,
    private toastr: ToastrService,
    private modal: NgbModal,
    private storageUser: LoginStorageUserService,
    public dialogService: DialogService
  ) {
    this.usuario = storageUser.getUser();
    this.dni_alumno = this.usuario?.dni;
    this.tipoAnexo = '';
  }

  ngOnInit(): void {
    delete this.dtOptions['language'];
    this.verAnexos();
    this.getArrayAnexos();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de datatables

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.anexosArray);
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
      this.dtTrigger.next(this.anexosArray);
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor

  /***********************************************************************/
  //#region Obtención de información: anexos y grupos

  /**
   * Este metodo te permite ver los anexos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public verAnexos() {
    this.anexoService
      .getAnexosAlumno(this.dni_alumno!)
      .subscribe((response) => {
        this.anexosArray = response;
        //#region Datatable
        response = (this.anexosArray as any).data;
        // Calling the DT trigger to manually render the table
        this.rerender();
        this.dtTrigger.next(this.anexosArray);
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
   * array de anexos
   */
  public getArrayAnexos() {
    this.anexoService.anexosArray.subscribe((array) => {
      this.anexosArray = array;
      this.rerender();
    });
  }
  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Descarga

  /**
   * Este metodo te permite descargar un anexo en concreto, comprobando si estamos
   * intentando descargar el anexo como tutor o como director/jefe de estudios
   * para usar una variable dni o la otra, te avisa si ha salido mal o bien
   * @param codigo es el mnombre del anexo a descargar
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public async descargarAnexo(codigo: string) {
    let hacerlo = await this.dialogService.confirmacion(
      'Descargar',
      `¿Está seguro de que desea descargar el anexo?`
    );
    if (hacerlo) {
      this.anexoService.descargarAnexo(this.dni_alumno!, codigo).subscribe({
        next: (res) => {
          const blob = new Blob([res], { type: 'application/octet-stream' });
          FileSaver.saveAs(blob, codigo);
          this.toastr.success('Anexo Descargado', 'Descarga');
        },
        error: (e) => {
          this.toastr.error('El anexo no ha podido descargarse', 'Fallo');
        },
      });
      this.router.navigate(['/data-management/anexos-alumnos']);
    } else {
      this.toastr.info('No has descargado el anexo', 'Descarga');
    }
  }

  /**
   * Esta funcion te permite descargar todos los anexos, te avisa si la descarga ha salido bien o mal
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public async descargarTodo() {
    let hacerlo = await this.dialogService.confirmacion(
      'Descargar',
      `¿Está seguro de que desea descargar los anexos?`
    );

    if (hacerlo) {
      this.anexoService.descargarTodoAlumnos(this.dni_alumno!).subscribe({
        next: (res) => {
          const current = new Date();
          const blob = new Blob([res], { type: 'application/octet-stream' });
          FileSaver.saveAs(blob, 'backup_' + current.getTime() + '.zip');
          this.toastr.success('Anexos Descargados', 'Descarga');
        },
        error: (e) => {
          this.toastr.error('Los anexos no han podido descargarse', 'Fallo');
        },
      });
      this.router.navigate(['/data-management/anexos-alumnos']);
    } else {
      this.toastr.info('No has descargado los anexos', 'Descarga');
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Esta funcion abre el manual de ayuda del crud de anexos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public abrirAyuda() {
    this.modal.open(ManualCrudAnexosAlumnosComponent, { size: 'lg' });
  }

  /**
   * Esta función te permite abrir el modal correcto para el tipo de anexo
   * que se quiere rellenar/observar
   * @param nombre  es el tipo de anexo que se va a rellenar
   * @param codigo  es el nombre de archivo que tiene el anexo, es un simple decorador
   * para el modal
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public abrirRelleno(nombre: string, codigo: string) {
    sessionStorage.setItem('tipoAnexo', nombre);
    sessionStorage.setItem('codigo', codigo);
    this.modal.open(ModalTipoAnexoComponent, { size: 'md' });
  }
  //#endregion
  /***********************************************************************/

  /**
   * Esta funcion abre el manual de ayuda del crud de anexos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public abrirModalUpload(nombre: string, codigo: string) {
    sessionStorage.setItem('tipoAnexo', nombre);
    sessionStorage.setItem('codigoAnexo', codigo);
    this.modal.open(ModalUploadAnexoComponent, { size: 'md' });
  }
}
