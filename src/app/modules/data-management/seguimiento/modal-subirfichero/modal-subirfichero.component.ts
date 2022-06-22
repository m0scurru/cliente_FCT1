import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SeguimientoServiceService } from 'src/app/services/seguimiento-service.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { ToastrService } from 'ngx-toastr';
import { SeguimientoComponent } from '../seguimiento.component';


@Component({
  selector: 'app-modal-subirfichero',
  templateUrl: './modal-subirfichero.component.html',
  styleUrls: ['./modal-subirfichero.component.scss']
})
export class ModalSubirficheroComponent implements OnInit {

  usuario;
  dni_usuario;
  public evento: any = null;
  dato: any;
  public static readonly anexoBase64: string = 'anexoBase64';

  constructor(
    private modalActive: NgbActiveModal,
    private seguimientoService: SeguimientoServiceService,
    private storageUser: LoginStorageUserService,
    private toastr: ToastrService,

  ) {
    this.usuario = storageUser.getUser();
    this.dni_usuario = this.usuario?.dni;

  }

  ngOnInit(): void {
    console.log(this.usuario);
  }



  public subirArchivo(event: any) {
    this.evento = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.evento);
    fileReader.onload = function (e: any) {
      sessionStorage.setItem(ModalSubirficheroComponent.anexoBase64, e.target.result)
    };
  }

  public aceptarArchivo() {
    let formData = new FormData();
    formData.append('dni', this.dni_usuario!);
    formData.append('file_name', this.evento.name);
    formData.append('file', sessionStorage.getItem(ModalSubirficheroComponent.anexoBase64)!);
    formData.append('id_fct', sessionStorage.getItem(SeguimientoComponent.id_fct)!);
    formData.append('id_quinto_dia', sessionStorage.getItem(SeguimientoComponent.id_quinto_dia)!);
    //Comprobamos que el checkbox esté marcado o no en cuanto al tutor de la empresa:
    var element = <HTMLInputElement> document.getElementById("checked");
    var isChecked = element.checked;
    if(isChecked){
      formData.append('firmado_tutor_empresa', '1');
    }else{
      formData.append('firmado_tutor_empresa', '0');
    }
    this.seguimientoService
      .subirAnexo3(formData).subscribe({
        next: (res: any) => {
          this.toastr.success(
            'Se ha subido el documento correctamente.',
            'Subida de documento'
          );
          location.reload();
        },
        error: (e) => {
          this.toastr.error(
            'No se ha podido subir el documento.',
            'Error en la subida del documento'
          );
          this.closeModel();
        },
      });

  }

  /**
 * Nos permite cerrar el modal de la nueva jornada pulsando la cruz situada arriba a la derecha.
 * @author Malena
 */
  closeModel() {
    this.modalActive.dismiss();
  }

}
