import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Jornada } from '../../../../models/Jornada/jornada';
import { ModalJornadaService } from '../../../../services/modal-jornada.service';
import { SeguimientoServiceService } from 'src/app/services/seguimiento-service.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.scss'],
})
export class ModalAddComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables

  usuario;
  jornada: FormGroup;
  submitted: boolean = false;
  public static readonly dniA: string = 'dniA';
  public jornadaEdit: string = '';
  public dni_alumno?: string;
  public jornadasArray: any = [];
  public fecha_invalida: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalJornadaService: ModalJornadaService,
    private modalActive: NgbActiveModal,
    private seguimientoService: SeguimientoServiceService,
    private storageUser: LoginStorageUserService,
    private toastr: ToastrService
  ) {
    this.usuario = storageUser.getUser();
    this.dni_alumno = this.usuario?.dni;

    this.jornada = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      actividad: ['', [Validators.required]],
      observaciones: [''],
      horas: ['', [Validators.required, Validators.max(10)]],
    });

    //Para editar la jornada:
    this.modalJornadaService.jornadaTrigger.subscribe((data: string) => {
      this.jornadaEdit = data;
    });
  }

  ngOnInit(): void {}

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión del formulario: registro de la jornada

  get formulario() {
    return this.jornada.controls;
  }

  /**
   * Añadir la jornada que ha añadido el alumno en la BBDD.
   * @author Malena
   */
  guardarJornada() {
    this.submitted = true;
    if (!this.jornada.valid) return;
    //Recojo los campos y los guardo en una nueva Jornada.
    //La id de la fct la mando vacía para establecerle su valor en el servidor buscando a qué fct está asociada ese alumno.
    this.fecha_invalida = this.comprobarFecha();
    if (this.fecha_invalida) return;
    var fecha_jornada = this.jornada.value.fecha;
    var actividades = this.jornada.value.actividad;
    var observaciones = this.jornada.value.observaciones;
    if (observaciones == undefined) {
      observaciones = '';
    }
    var tiempo_empleado = this.jornada.value.horas;

    let jornada = new Jornada(
      0,
      0,
      fecha_jornada,
      actividades,
      observaciones,
      tiempo_empleado
    );

    this.modalJornadaService.addJornada(jornada, this.dni_alumno!).subscribe({
      next: (response) => {
        this.toastr.success('Jornada añadida correctamente.', 'Nueva jornada');
        this.recogerJornadas();
        this.closeModel();
      },
      error: (e) => {
        this.toastr.error(
          'Oh vaya, algo ha fallado al añadir una jornada.',
          'Error al añadir jornada'
        );
      },
    });
  }

  /**
   * Método que comprueba si la fecha introducida es superior a la de hoy, en este caso devolverá False.
   * @returns Boolean
   * @author Malena
   */
  public comprobarFecha() {
    var hoy = new Date();
    return new Date(this.jornada.value.fecha) > hoy;
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
        this.jornadasArray = response;
        this.modalJornadaService.getJornadasInArray(this.jornadasArray);
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
    this.modalActive.dismiss();
  }

  //#endregion
  /***********************************************************************/
}
