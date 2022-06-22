import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tutor } from 'src/app/models/tutor';
import { SeguimientoServiceService } from 'src/app/services/seguimiento-service.service';
import { ToastrService } from 'ngx-toastr';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-cambiotutor',
  templateUrl: './modal-cambiotutor.component.html',
  styleUrls: ['./modal-cambiotutor.component.scss'],
})
export class ModalCambiotutorComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables

  usuario;
  public static readonly id_empresa: string = 'id_empresa';
  public arrayTutores: Tutor[] = [];
  public dni_alumno?: string;
  public mail_tutor?: string;
  nuevo_tutor: FormGroup;

  constructor(
    private modalActive: NgbActiveModal,
    private seguimientoService: SeguimientoServiceService,
    private toastr: ToastrService,
    private storageUser: LoginStorageUserService,
    private formBuilder: FormBuilder
  ) {
    this.usuario = storageUser.getUser();
    this.dni_alumno = this.usuario?.dni;

    this.nuevo_tutor = this.formBuilder.group({
      nuevoTu: [""],
    });
  }

  ngOnInit(): void {
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor: registro y actualización del tutor

  /**
   * Método que actualiza en la BBDD y en la interfaz del Anexo III el dni del tutor
   * al que está asociado el alumno.
   * @author Malena
   */
  public actualizarTutor() {
    this.mail_tutor = this.nuevo_tutor.value.nuevoTu;
    this.seguimientoService
      .guardarTutorSeleccionado(this.mail_tutor!, this.dni_alumno!)
      .subscribe({
        next: (response) => {
          this.toastr.success(
            'Tutor actualizado correctamente.',
            'Actualización de tutor'
          );
          //No sé si esto es un poco ñapa, pero es que tengo que terminar muchas cosas :(
          setTimeout(function () {
            window.location.reload();
          }, 1000);
          this.closeModel();
        },
        error: (e) => {
          this.toastr.error(
            'No se ha encontrado al tutor seleccionado.',
            'Error al actualizar tutor'
          );
          this.closeModel();
        },
      });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Método para cerrar el modal.
   * @author Malena
   */
  closeModel() {
    this.modalActive.dismiss();
  }

  //#endregion
  /***********************************************************************/
}
