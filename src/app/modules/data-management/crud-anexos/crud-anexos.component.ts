import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnexoService } from 'src/app/services/crud-anexos.service';
import * as FileSaver from 'file-saver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFirmaComponent } from '../modal-firma/modal-firma.component';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { Subject } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { ManualCrudAnexosComponent } from '../../manuales/manual-crud-anexos/manual-crud-anexos.component';
import { DataTableDirective } from 'angular-datatables';
import { ModalUploadAnexoComponent } from '../modal-upload-anexo/modal-upload-anexo.component';

@Component({
  selector: 'app-crud-anexos',
  templateUrl: './crud-anexos.component.html',
  styleUrls: ['./crud-anexos.component.scss'],
})
export class CrudAnexosComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })

  /***********************************************************************/
  //#region Inicialización de variables
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;

  usuario;
  anexosArray: any = [];
  gruposArr: any = [];
  dni_tutor?: string;
  dniAux?: string;
  codigo: string = '';
  habilitado: number;

  constructor(
    private anexoService: AnexoService,
    private router: Router,
    private toastr: ToastrService,
    private modal: NgbModal,
    private storageUser: LoginStorageUserService,
    public dialogService: DialogService
  ) {
    this.usuario = storageUser.getUser();
    this.dni_tutor = this.usuario?.dni;
    this.habilitado= 1;
  }


  ngOnInit(): void {
    delete this.dtOptions['language'];

    if (this.usuario!.isTutor()) {
      this.verAnexos();
      this.getArrayAnexos();
    } else {
      this.verGrupos();
      this.getArrayAnexos();
    }
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
   * @author Pablo y Laura <lauramorenoramos97@gmail.com>
   */
  public verAnexos() {
    this.anexoService.getAnexos(this.dni_tutor!,1).subscribe((response) => {
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
   * Este metodo sirve para traer los grupos y su tutor de un centro de estudio
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public verGrupos() {
    this.anexoService.getGrupos(this.dni_tutor!).subscribe((response) => {
      this.gruposArr = response;
      this.dniAux = this.gruposArr[0].dni_profesor;
      this.verAnexosDirector();
    });
  }

  /**
   * Este metodo te permite ver los anexos para el director
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public verAnexosDirector() {
    this.anexoService.getAnexos(this.dniAux!,1).subscribe({
      next: (res) => {
        this.anexosArray = res;
        this.toastr.info('Anexos de: ' + this.dniAux, 'Vistas Anexos');
        res = (this.anexosArray as any).data;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next(this.anexosArray);
        $.fn.dataTable.ext.errMode = 'throw';
      },
      error: (e) => {
        this.toastr.error(
          'Los anexos afiliados a este grupo no han podido visualizarse',
          'Fallo'
        );
        this.anexosArray = null;
      },
    });
    $.extend(true, $.fn.dataTable.defaults, {
      language: { url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' },
    });
  }

  /**
   * Este metodo te permite ver los anexos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public verAnexosEliminar() {
    this.anexoService.getAnexos(this.dni_tutor!,1).subscribe((response) => {
      this.anexosArray = response;
      response = (this.anexosArray as any).data;
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
   * @author Pablo
   */
  public async descargarAnexo(codigo: string) {
    let hacerlo = await this.dialogService.confirmacion(
      'Descargar',
      `¿Está seguro de que desea descargar el anexo?`
    );

    if (hacerlo) {
      let dni: string;

      if (this.usuario?.isTutor()) {
        dni = this.dni_tutor!;
      } else {
        dni = this.dniAux!;
      }

      this.anexoService.descargarAnexo(dni, codigo).subscribe({
        next: (res) => {
          const blob = new Blob([res], { type: 'application/octet-stream' });
          FileSaver.saveAs(blob, codigo);
          this.toastr.success('Anexo Descargado', 'Descarga');
        },
        error: (e) => {
          this.toastr.error('El anexo no ha podido descargarse', 'Fallo');
        },
      });
      this.router.navigate(['/data-management/crud-anexos']);
    } else {
      this.toastr.info('No has descargado el anexo', 'Descarga');
    }
  }

  /**
   * Esta funcion te permite descargar todos los anexos, te avisa si la descarga ha salido bien o mal
   * @author Pablo
   */
  public async descargarTodo() {
    let hacerlo = await this.dialogService.confirmacion(
      'Descargar',
      `¿Está seguro de que desea descargar los anexos?`
    );

    if (hacerlo) {
      let dni: string;

      if (this.usuario?.isTutor()) {
        dni = this.dni_tutor!;
      } else {
        dni = this.dniAux!;
      }

      this.anexoService.descargarTodo(dni, this.habilitado).subscribe({
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
      this.router.navigate(['/data-management/crud-anexos']);
    } else {
      this.toastr.info('No has descargado los anexos', 'Descarga');
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Eliminación y deshabilitación

  /**
   * Esta funcion te permite deshabilitar un anexo, suscribiendote al metodo deshabilitar anexo del servicio
   * Ademas, te avisa si todo ha salido bien o mal, por ultimo, vuelve a llamar a la funcion para
   * que se refresque la vista
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public async deshabilitarAnexo(codigo: string) {
    let hacerlo = await this.dialogService.confirmacion(
      'Deshabilitar',
      `¿Está seguro de que desea Deshabilitar el anexo?: ` + codigo
    );

    if (hacerlo) {
      let dni: string;

      if (this.usuario?.isTutor()) {
        dni = this.dni_tutor!;
      } else {
        dni = this.dniAux!;
      }
      this.anexoService.deshabilitarAnexo(codigo).subscribe({
        next: (res) => {
          this.toastr.success('Anexo Deshabilitado', 'Deshabilitado');

          if(this.usuario?.isTutor()){
            this.verAnexos();
          }else{
            this.verGrupos();
          }
        },
        error: (e) => {
          console.log(e);
          this.toastr.error('El anexo no ha podido deshabilitarse', 'Fallo');
        },
      });
    } else {
      this.toastr.info(
        'Has decidido no deshabilitar el anexo',
        'No deshabilitado'
      );
    }
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Abre un modal para la firma del anexo
   * @author Pablo
   */
  public abrirModalFirma(codigo_anexo: string) {
    const modalFirma = this.modal.open(ModalFirmaComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
    modalFirma.componentInstance.codigo_anexo = codigo_anexo;
  }

  /**
   * Esta funcion abre el manual de ayuda del crud de anexos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public abrirAyuda() {
    this.modal.open(ManualCrudAnexosComponent, { size: 'lg' });
  }

  /**
   * Este método busca a un tutor para mostrar sus anexos
   * @param dni es el dni del tutor a buscar para mostrar sus anexos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public buscar(event: any) {
    this.dniAux = event.target.value;
    this.verAnexosDirector();
  }

  //#endregion
  /***********************************************************************/

   /**
   * Esta funcion abre el manual de ayuda del crud de anexos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
    public abrirModalUpload(nombre : string,codigo:string) {
      sessionStorage.setItem('tipoAnexo', nombre);
      sessionStorage.setItem('codigoAnexo',codigo);
      sessionStorage.setItem('llamadaDesdeCrud','1');
      this.modal.open(ModalUploadAnexoComponent, { size: 'md' });
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
}
