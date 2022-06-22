import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AnexoUpload } from 'src/app/models/anexo-upload';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { AnexoService } from 'src/app/services/crud-anexos.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-upload-anexo',
  templateUrl: './modal-upload-anexo.component.html',
  styleUrls: ['./modal-upload-anexo.component.scss'],
})
export class ModalUploadAnexoComponent implements OnInit {
  usuario;
  dni_usuario;
  public evento: any = null;
  public anexosArray: any = [];
  tipoAnexo: any;

  constructor(
    private anexoService: AnexoService,
    private toastr: ToastrService,
    private modalActive: NgbActiveModal,
    private uploadService: FileUploadService,
    private storageUser: LoginStorageUserService,
    private modal: NgbModal
  ) {
    this.usuario = storageUser.getUser();
    this.dni_usuario = this.usuario?.dni;
    this.tipoAnexo = sessionStorage.getItem('tipoAnexo');
  }

  ngOnInit(): void {}

  /**
   *
   * @param event
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
   * Si la llamada es desde el crud de anexos cogeremos el nombre original del archivo
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public enviarAnexo() {

    /***********************************************************************/
    //#region Gestión del nombre
    let nombreArchivo: any;
    let nombreSinExtension: any;
    let extension: any;

    //Gestion de nombre
    extension = this.evento.name.split('.');
    extension = '.' + extension[extension.length - 1];
    nombreSinExtension = sessionStorage.getItem('codigoAnexo')!.split('.');
    nombreSinExtension = nombreSinExtension[0];
    nombreArchivo = nombreSinExtension + extension;

    //#endregion
    /***********************************************************************/

    let datos = new AnexoUpload(
      sessionStorage.getItem('fichero')!,
      this.tipoAnexo,
      nombreArchivo,
      this.dni_usuario!
    );
    this.uploadService.subirAnexo(datos).subscribe({
      next: (res) => {
        this.toastr.success('Anexo Subido', 'Hecho!');

        /***********************************************************************/
        //#region Refresco
        if (
          this.usuario?.isProfesor() ||
          this.usuario?.isJefatura() ||
          this.usuario?.isDirector()
        ) {
          this.recogerAnexosFCT();
        }

        if (this.usuario?.isAlumno()) {
          this.recogerAnexosAlumnos();
        }
        //#endregion
        /***********************************************************************/
      },
      error: (e) => {
        console.log(e);
        this.toastr.error('El anexo no ha podido subirse', 'Fallo');
      },
    });
  }

  /**
   * Esta funcion te permite cerrar un modal con la cruz situada arriba a la derecha
   * @author Laura <lauramorenoramos@gmail.com>
   */
  CloseModal() {
    this.modalActive.dismiss();
  }

  /**
   * Esta funcion recoge  el nuevo array actualizado de anexos para darselo
   * a la ventana principal y que se muestre actualizada
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public recogerAnexosFCT() {
    this.anexoService.getAnexos(this.dni_usuario!, 1).subscribe({
      next: (response: any) => {
        this.anexosArray = response;
        this.anexosArray.getAnexosInArray(this.anexosArray);
      },
      error: (e) => {
        this.toastr.error('Los anexos no han podido mostrarse', 'Fallo');
      },
    });
  }

  /**
   * Esta funcion recoge  el nuevo array actualizado de anexos de los alumnos para darselo
   * a la ventana principal y que se muestre actualizada
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public recogerAnexosAlumnos() {
    this.anexoService.getAnexosAlumno(this.dni_usuario!).subscribe({
      next: (response: any) => {
        this.anexosArray = response;
        this.anexoService.getAnexosInArray(this.anexosArray);
      },
      error: (e) => {
        this.toastr.error('Los anexos no han podido mostrarse', 'Fallo');
      },
    });
  }
}
