import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalJornadaService } from '../../../../services/modal-jornada.service';
import { Jornada } from 'src/app/models/Jornada/jornada';
import { SeguimientoServiceService } from 'src/app/services/seguimiento-service.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-modal-editar',
  templateUrl: './modal-editar.component.html',
  styleUrls: ['./modal-editar.component.scss'],
})
export class ModalEditarComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables

  usuario;
  editarJornada: FormGroup;
  submitted: boolean = false;
  public jornada?: Jornada;
  public dni_alumno?: string;
  public arrayJornadas: any = [];
  public fecha_invalida: boolean = false;
  public modified: boolean = false;

  constructor(
    private modalActive: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalJornadaService: ModalJornadaService,
    private seguimientoService: SeguimientoServiceService,
    private storageUser: LoginStorageUserService,
    private toastr: ToastrService,
    public dialogService: DialogService
  ) {
    this.usuario = storageUser.getUser();
    this.dni_alumno = this.usuario?.dni;

    this.editarJornada = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      actividad: ['', [Validators.required]],
      observaciones: [''],
      horas: ['', [Validators.required, Validators.max(10)]],
    });

    this.modalJornadaService.jornadaTrigger.subscribe((data: Jornada) => {
      this.jornada = data;
    });
  }

  ngOnInit(): void {}

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión del formulario

  get formulario() {
    return this.editarJornada.controls;
  }

  /**
   * Método que comprueba si hay algún cambio en el formulario.
   * @author Malena
   */
  onChanges(): void {
    this.editarJornada.valueChanges.subscribe((val) => {
      if (!this.modified) {
        this.modified = true;
      }
    });
  }

  /**
   * Método que comprueba si la fecha introducida es superior a la de hoy, en este caso devolverá False.
   * @returns Boolean
   * @author Malena
   */
  public comprobarFecha() {
    var hoy = new Date();
    return new Date(this.editarJornada.value.fecha) > hoy;
  }

  /**
   * Metodo que recoge los campos de la jornada que quiere editar el alumno, los cambia
   * y los envia al servidor para poder actualizarlos en la BBDD.
   * @author Malena.
   */
  public editJornada() {
    this.submitted = true;
    if (!this.editarJornada.valid) return;

    if (this.jornada != undefined) {
      var id_jornada = this.jornada.id_jornada;
      var orden_jornada = this.jornada.orden_jornada;
      this.fecha_invalida = this.comprobarFecha();
      if (this.fecha_invalida) return;
      var fecha_jornada = this.jornada.fecha_jornada;
      var actividades = this.jornada.actividades;
      var observaciones = this.jornada.observaciones;
      var tiempo_empleado = this.jornada.tiempo_empleado;

      var jornadaUpdate = new Jornada(
        id_jornada,
        orden_jornada,
        fecha_jornada,
        actividades,
        observaciones,
        tiempo_empleado
      );
      this.modalJornadaService
        .updateJornada(jornadaUpdate, this.dni_alumno!)
        .subscribe({
          next: (response) => {
            this.toastr.success(
              'La jornada se ha actualizado correctamente.',
              'Editar jornada'
            );
            this.recogerJornadas();
            this.modalActive.dismiss();
          },
          error: (e) => {
            this.toastr.error(
              'No se ha actualizado la jornada.',
              'Error al editar jornada'
            );
          },
        });
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor

  /**
   * Método que recoge las jornadas correspondientes al alumno y las muestra por pantalla.
   * @author Malena.
   */
  public recogerJornadas() {
    this.seguimientoService.devolverJornadas(this.dni_alumno!).subscribe({
      next: (response: any) => {
        this.arrayJornadas = response;
        this.modalJornadaService.getJornadasInArray(this.arrayJornadas);
      },
      error: (e) => {},
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Nos permite cerrar el modal de la nueva jornada pulsando la cruz situada arriba a la derecha.
   * @author Malena
   */
  closeModel() {
    if (this.modified) {
      this.confirmacion();
    } else {
      this.modalActive.dismiss();
    }
  }

  /**
   * Método que abre el modal Dialog para preguntar si queremos salir sin guardar o no.
   * @author Malena
   */
  public async confirmacion() {
    let cerrar = await this.dialogService.confirmacion(
      'Descartar cambios',
      'Tiene cambios sin guardar, ¿Desea salir igualmente?'
    );
    if (cerrar) {
      //Si quiero descartar los cambios y dejarlo como estaba...
      window.location.reload();
      this.modalActive.dismiss();
    }
  }

  //#endregion
  /***********************************************************************/
}
