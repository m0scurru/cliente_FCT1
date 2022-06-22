import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as FileSaver from 'file-saver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ToastrService } from 'ngx-toastr';
import { AnexoUpload } from 'src/app/models/anexo-upload';
import { DataTableDirective } from 'angular-datatables';
import { AnexoService } from 'src/app/services/crud-anexos.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { ModalUploadAnexoComponent } from '../modal-upload-anexo/modal-upload-anexo.component';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ManualAnexo2y4Component } from '../../manuales/manual-anexo2y4/manual-anexo2y4.component';

@Component({
  selector: 'app-programa-formativo',
  templateUrl: './programa-formativo.component.html',
  styleUrls: ['./programa-formativo.component.scss'],
})
export class ProgramaFormativoComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;

  usuario;
  dni_usuario;
  public evento: any = null;
  tipoAnexo: any;
  anexosArray: any;

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: FileUploadService,
    private toastr: ToastrService,
    private router: Router,
    private modal: NgbModal,
    private anexoService: AnexoService,
    private storageUser: LoginStorageUserService,
    public dialogService: DialogService
  ) {
    this.usuario = storageUser.getUser();
    this.dni_usuario = this.usuario?.dni;
    this.tipoAnexo = 'Anexo2';
  }

  ngOnInit(): void {
    delete this.dtOptions['language'];
    this.listarAnexos();
  }

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

  /**
   *Esta función se encarga de recoger el fichero que se ha seleccionado, guardarlo en un session Storage y
   * pasar el fichero a base 64
   * @param event
   * @author David
   */
  public upload(event: any) {
    this.evento = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.evento);
    fileReader.onload = function (e: any) {
      sessionStorage.setItem('fichero', e.target.result);
    };
  }

  /**
   *
   */
  public enviarAnexo() {
    if (
      this.evento.name == 'Anexo2.docx' ||
      this.evento.name == 'Anexo4.docx'
    ) {
      if (
        this.evento.name == 'Anexo2.docx'
      ) {
        this.tipoAnexo = 'Anexo2';
      } else {
        this.tipoAnexo = 'Anexo4';
      }
      let datos = new AnexoUpload(
        sessionStorage.getItem('fichero')!,
        this.tipoAnexo,
        this.evento.name,
        this.dni_usuario!
      );

      this.uploadService.subirAnexo(datos).subscribe({
        next: (res) => {
          this.toastr.success(this.tipoAnexo + ' Subido', 'Hecho!');
          this.rellenarAnexo();
        },
        error: (e) => {
          console.log(e);
          this.toastr.error(
            'El anexo ' + this.tipoAnexo + ' no ha podido subirse',
            'Fallo'
          );
        },
      });
    } else {
      this.toastr.error(
        'El anexo debe llamarse Anexo2.docx o Anexo4.docx',
        'Fallo'
      );
    }
  }

  /**
   * Esta funcion llama a la funcion rellenarAnexoIIyIV del servicio AnexoService para
   * que se rellene el AnexoII o IV según lo que seleccione el usuario en el desplegable
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public rellenarAnexo() {
    this.anexoService
      .rellenarAnexoIIyIV(this.evento.name, this.dni_usuario!)
      .subscribe({
        next: (res) => {
          const current = new Date();
          const blob = new Blob([res], { type: 'application/octet-stream' });
          FileSaver.saveAs(blob, 'backup_' + current.getTime() + '.zip');
          this.toastr.success(this.tipoAnexo + ' Descargado', 'Hecho!');
          this.listarAnexos();
        },
        error: (e) => {
          console.log(e);
          this.toastr.error(
            'El ' + this.tipoAnexo + ' no ha podido descargarse',
            'Fallo'
          );
        },
      });
  }

  /**
   * Esta función lista los anexos 2 y 4 de los alumnos de un tutor
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public listarAnexos() {
    this.anexoService
      .getAnexosProgramaFormativo(this.dni_usuario!)
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
      //let dni: string;

      /* if (this.usuario?.isTutor()) {
          dni = this.dni_tutor!;
        } else {
          dni = this.dniAux!;
        }*/

      this.anexoService.descargarAnexo(this.dni_usuario!, codigo).subscribe({
        next: (res) => {
          const current = new Date();
          const blob = new Blob([res], { type: 'application/octet-stream' });
          FileSaver.saveAs(blob, codigo);
          this.toastr.success('Anexo Descargado', 'Descarga');
        },
        error: (e) => {
          this.toastr.error('El anexo no ha podido descargarse', 'Fallo');
        },
      });
      this.router.navigate(['/data-management/programa-formativo']);
    } else {
      this.toastr.info('No has descargado el anexo', 'Descarga');
    }
  }

  /**
   * Esta funcion abre el manual de ayuda del crud de anexos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public abrirModalUpload(nombre: string, codigo: string) {
    sessionStorage.setItem('tipoAnexo', nombre);
    sessionStorage.setItem('codigoAnexo', codigo);
    this.modal.open(ModalUploadAnexoComponent, { size: 'md' });
  }

  /**
   * Esta funcion abre el manual de ayuda del crud de anexos
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public abrirAyuda() {
    this.modal.open(ManualAnexo2y4Component, { size: 'lg' });
  }
}
