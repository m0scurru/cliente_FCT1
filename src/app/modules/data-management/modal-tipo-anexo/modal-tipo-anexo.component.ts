import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnexoService } from 'src/app/services/crud-anexos.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-modal-tipo-anexo',
  templateUrl: './modal-tipo-anexo.component.html',
  styleUrls: ['./modal-tipo-anexo.component.scss']
})
export class ModalTipoAnexoComponent implements OnInit {

   /***********************************************************************/
  //#region Inicialización de variables y formulario

  tipoAnexo: any = [];
  codAnexo: any = [];

  usuario;
  dni?: string;
  submitted: boolean = false;
  public anexosArray: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalActive: NgbActiveModal,
    private anexoService: AnexoService,
    private toastr: ToastrService,
    private storageUser: LoginStorageUserService,
    private modal: NgbModal
  ) {
    this.tipoAnexo = sessionStorage.getItem('tipoAnexo');
    this.codAnexo= sessionStorage.getItem('codigo');

    this.usuario = storageUser.getUser();
    this.dni = this.usuario?.dni;

  }

  ngOnInit(): void {

  }

  //#endregion
  /***********************************************************************/



    /***********************************************************************/
  //#region Gestión del formulario

  /*get formulario() {
    return this.AnexoXV.controls;
  }*/

  public onSubmit() {
    this.submitted = true;
    if(this.tipoAnexo=='AnexoXV'){
      this.anexoService.rellenarAnexoXV(this.dni!,this.codAnexo).subscribe({
        next: (response: any) => {
          this.toastr.success('El AnexoXV se ha generado!', 'Hecho!');
          const blob = new Blob([response], { type: 'application/octet-stream' });
          FileSaver.saveAs(blob, this.codAnexo);
          this.toastr.success('Anexo Descargado', 'Descarga');
          this.recogerAnexosAlumnos();
        },
        error: (e) => {
          this.toastr.error('El AnexoXV no ha podido generarse', 'Fallo');
        },
      });
    }
  }
    //#endregion
  /***********************************************************************/


  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Esta funcion te permite cerrar un modal con la cruz situada arriba a la derecha
   * @author Laura <lauramorenoramos@gmail.com>
   */
   CloseModal() {
    this.modalActive.dismiss();
  }

          /**
   * Esta funcion recoge  el nuevo array actualizado de anexos de los alumnos para darselo
   * a la ventana principal y que se muestre actualizada
   * @author Laura <lauramorenoramos@gmail.com>
   */
           public recogerAnexosAlumnos() {
            this.anexoService.getAnexosAlumno(this.dni!).subscribe({
              next: (response: any) => {
                this.anexosArray = response;
                this.anexoService.getAnexosInArray(this.anexosArray);
              },
              error: (e) => {
                this.toastr.error('Los anexos no han podido mostrarse', 'Fallo');
              },
            });
          }

  //#endregion
  /***********************************************************************/
}


