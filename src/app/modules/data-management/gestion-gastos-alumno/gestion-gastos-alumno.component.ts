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
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ModoEdicion } from 'src/app/models/modoEdicion';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FacturaTransporte } from 'src/app/models/facturaTransporte';
import { GestionGastosService } from 'src/app/services/gestion-gastos.service';
import { Gasto } from 'src/app/models/gasto';
import { FacturaManutencion } from 'src/app/models/facturaManutencion';
import { ModalGestionGastosAlumnoComponent } from '../modal-gestion-gastos-alumno/modal-gestion-gastos-alumno.component';
import { ModalTicketDesplazamiento } from '../modal-ticket-desplazamiento/modal-ticket-desplazamiento.component';
import { ModalTicketManutencion } from '../modal-ticket-manutencion/modal-ticket-manutencion.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { AnexoService } from 'src/app/services/crud-anexos.service';
import * as FileSaver from 'file-saver';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ManualGestionGastosAlumnoComponent } from '../../manuales/manual-gestion-gastos-alumno/manual-gestion-gastos-alumno.component';

@Component({
  selector: 'app-gestion-gastos-alumno',
  templateUrl: './gestion-gastos-alumno.component.html',
  styleUrls: ['./gestion-gastos-alumno.component.scss'],
})
export class GestionGastosAlumnoComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild(DataTableDirective, { static: false })

  /***********************************************************************/
  //#region Inicialización de variables
  public dtElement?: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger = new Subject<any>();

  public gasto?: Gasto;
  public dias_transporte_privado: number = 0;
  public modosEdicion: typeof ModoEdicion = ModoEdicion;
  public isVisible: number = 1;
  public isSelected: boolean = true;
  public dniAlumno = '';

  constructor(
    private gestionGastosService: GestionGastosService,
    public loginStorageUser: LoginStorageUserService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private anexosService: AnexoService,
    private fileUpload: FileUploadService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['rol'] == 'Profesor') {
        this.dniAlumno = params['dni'];
      } else {
        this.dniAlumno = this.loginStorageUser.getUser()!.dni;
      }

      this.cargarGasto();

      $.extend(true, $.fn.dataTable.defaults, {
        language: {
          url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json',
        },
      });

      $.fn.dataTable.ext.errMode = 'none';
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de datatables

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.gasto);
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
  //#region Obtención de información: gasto

  /**
   * Llama al servicio que realiza la petición al servidor y gestiona la respuesta
   * @author David Sánchez Barragán
   */
  cargarGasto() {
    this.gestionGastosService.obtenerGastosAlumno(this.dniAlumno).subscribe({
      next: (result) => {
        this.gasto = result;
        this.rerender();
        this.dtTrigger.next(this.gasto);
      },
      error: (error) => {
        this.toastr.error('No se han podido recuperar los datos', 'Error');
        this.gasto = undefined;
      },
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Actualización
  actualizarDiasVehiculoPrivado() {
    this.gasto!.dias_transporte_privado = this.dias_transporte_privado;
    this.gestionGastosService
      .actualizarDiasVehiculoPrivado(this.gasto!)
      .subscribe({
        next: (result) => {
          this.cargarGasto();
          this.toastr.success('Días actualizados correctamente');
        },
        error: (error) => {
          this.toastr.error('No se han podido actualizar los datos', 'Error');
        },
      });
  }
  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Eliminación

  /**
   * Gestiona la llamada al servicio que eliminará la factura de la base de datos
   * @param id ID del objeto a eliminar
   * @author David Sánchez Barragán
   */
  borrarFacturaTransporte(id: any) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar factura',
          message: `¿Está seguro de que quiere eliminar esta factura?`,
        },
        width: '400px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.respuesta) {
          this.gestionGastosService.eliminarFacturaTransporte(id).subscribe({
            next: (response: any) => {
              this.cargarGasto();
              this.toastr.success('Factura borrada correctamente');
            },
            error: (error) => {
              this.toastr.error('Ha ocurrido un error al eliminar la factura');
            },
          });
        }
      });
  }

  /**
   * Gestiona la llamada al servicio que eliminará la factura de la base de datos
   * @param id ID del objeto a eliminar
   * @author David Sánchez Barragán
   */
  borrarFacturaManutencion(id: any) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar factura',
          message: `¿Está seguro de que quiere eliminar esta factura?`,
        },
        width: '400px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.respuesta) {
          this.gestionGastosService.eliminarFacturaManutencion(id).subscribe({
            next: (response: any) => {
              this.cargarGasto();
              this.toastr.success('Factura borrada correctamente');
            },
            error: (error) => {
              this.toastr.error('Ha ocurrido un error al eliminar la factura');
            },
          });
        }
      });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Anexo V

  /**
   * Envía una señal al servidor para confirmar los gastos y generar el Anexo V,
   * dando la opción al usuario de descargarlo
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public async confirmarGastos() {
    let confirmar = await this.dialogService.confirmacion(
      'Confirmar gastos',
      '¿Está seguro de que desea confirmar los gastos? Si ha subido el Anexo V firmado, tendrá que volver a subirlo'
    );
    if (confirmar) {
      this.gestionGastosService.confirmarGastos(this.gasto!).subscribe({
        next: async (res) => {
          let descargar = await this.dialogService.confirmacion(
            'Descargar Anexo V',
            'Se ha generado el documento del recibí (Anexo V). ¿Desea descargarlo ahora? Podrá hacerlo más tarde en Anexos'
          );
          if (descargar) {
            let ruta = res.ruta_anexo;
            this.anexosService.descargarAnexoRuta(res.ruta_anexo).subscribe({
              next: (res) => {
                let arr = ruta.split('\\', 3);
                let nombre = arr.pop();
                const blob = new Blob([res], {
                  type: 'application/octet-stream',
                });
                FileSaver.saveAs(blob, nombre);
                this.toastr.success('Descargando Anexo V');
              },
              error: (err) => {
                this.toastr.error('Error al descargar el Anexo V', 'Error de descarga');
              },
            });
          }
        },
        error: (err) => {
          this.toastr.error(
            'Vuelva a intentarlo más tarde',
            'Error al confirmar los gastos'
          );
        },
      });
    }
  }

  /**
   * Sube el Anexo V al servidor
   *
   * @param event
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public subirAnexoV(event: any): void {
    let files = event.target.files[0];
    let datos = {
      dni: this.gasto?.dni_alumno,
      curso_academico: this.gasto?.curso_academico,
      file: ''
    }
    let upload = this.fileUpload;
    let toastr = this.toastr;
    if (files) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.onload = function () {
        datos.file = this.result as string;
        upload.subirAnexoV(datos).subscribe({
          next: res => {
            toastr.success('Anexo V subido correctamente')
          },
          error: err => {
            toastr.error('Vuelve a intentarlo', 'Error al subir el fichero')
          }
        });
      };
    }
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Invocación de modales
  /**
   * Abre un modal para editar los datos del alumno
   * @author David Sánchez Barragán
   */
  editarDatosAlumno() {
    this.modal.open(ModalGestionGastosAlumnoComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    let gasto = this.gasto;
    this.gestionGastosService.gastoTrigger.emit([gasto]);

    this.obtenerGastoDesdeModal();
  }

  /**
   * Abre el modal para agregar una nueva factura de transporte
   */
  nuevoTicketTransporte() {
    let facturaT = new FacturaTransporte(0, '', '', new Date(), 0, '');
    this.modal.open(ModalTicketDesplazamiento, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });

    this.gestionGastosService.facturaTransporteTrigger.emit([
      facturaT,
      ModoEdicion.nuevo,
      this.dniAlumno,
    ]);

    this.obtenerGastoDesdeModal();
  }

  /**
   * Abre el modal para agregar una nueva factura de transporte
   */
  nuevoTicketManutencion() {
    let facturaM = new FacturaManutencion(0, '', '', new Date(), 0, '');
    this.modal.open(ModalTicketManutencion, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });

    this.gestionGastosService.facturaManutencionTrigger.emit([
      facturaM,
      ModoEdicion.nuevo,
      this.dniAlumno,
    ]);

    this.obtenerGastoDesdeModal();
  }

  /**
   * Abre un modal para ver o editar una factura de transporte
   * @param factura Objeto con los datos de la factura
   * @param modoEdicion 0 -> edición, 1 -> creación, 2 -> sólo lectura
   * @author David Sánchez Barragán
   */
  mostrarFacturaTransporte(fact: FacturaTransporte, modoEdicion: ModoEdicion) {
    this.modal.open(ModalTicketDesplazamiento, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });

    this.gestionGastosService.facturaTransporteTrigger.emit([
      fact,
      modoEdicion,
      this.dniAlumno,
    ]);

    this.obtenerGastoDesdeModal();
  }

  /**
   * Abre un modal para ver o editar una factura de transporte
   * @param factura Objeto con los datos de la factura
   * @param modoEdicion 0 -> edición, 1 -> creación, 2 -> sólo lectura
   * @author David Sánchez Barragán
   */
  mostrarFacturaManutencion(
    fact: FacturaManutencion,
    modoEdicion: ModoEdicion
  ) {
    this.modal.open(ModalTicketManutencion, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });

    this.gestionGastosService.facturaManutencionTrigger.emit([
      fact,
      modoEdicion,
      this.dniAlumno,
    ]);

    this.obtenerGastoDesdeModal();
  }

  /**
   * Actualiza los datos del gasto respecto de las modificaciones en el modal
   * @author David Sánchez Barragán
   */
  public obtenerGastoDesdeModal() {
    this.gestionGastosService.gastoBS.subscribe((gasto) => {
      this.gasto = gasto;
      this.dtTrigger.next(this.gasto);
    });
  }

  /**
   * Abre un modal de ayuda
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public abrirAyuda(): void {
    this.modal.open(ManualGestionGastosAlumnoComponent, { size: 'lg' });
  }

  public volver() {
    this.router.navigate(['/data-management/gestion-gastos-profesor']);
  }

  //#endregion
  /***********************************************************************/
}
