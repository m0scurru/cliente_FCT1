import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Alumno } from 'src/app/models/alumno';
import { Gasto } from 'src/app/models/gasto';
import { Grupo } from 'src/app/models/grupo';
import { ModoEdicion } from 'src/app/models/modoEdicion';
import { AuxService } from 'src/app/services/aux-service.service';
import { CrudAlumnosService } from 'src/app/services/crud-alumnos.service';
import { DialogService } from 'src/app/services/dialog.service';
import { GestionGastosService } from 'src/app/services/gestion-gastos.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';

@Component({
  selector: 'app-modal-gestion-gastos-alumno',
  templateUrl: './modal-gestion-gastos-alumno.component.html',
  styleUrls: ['./modal-gestion-gastos-alumno.component.scss'],
})
export class ModalGestionGastosAlumnoComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables y formulario

  public gasto?: Gasto;
  public datosAlumno: FormGroup;
  public submitted: boolean = false;
  public modified: boolean = false;

  constructor(
    private modalActive: NgbActiveModal,
    private gestionGastosService: GestionGastosService,
    private auxService: AuxService,
    private loginService: LoginStorageUserService,
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    public toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.datosAlumno = this.formBuilder.group({});

    this.gestionGastosService.gastoTrigger.subscribe({
      next: (data: Array<any>) => {
        this.gasto = data[0];

        this.construirFormulario();
      },
    });
  }

  ngOnInit(): void {
    this.onChanges();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Formulario

  /**
   * Construye un formulario con los campos inicializados
   * @author David Sánchez Barragán
   */
  construirFormulario() {
    this.datosAlumno = this.formBuilder.group({
      residencia_alumno: [this.gasto?.residencia_alumno, [Validators.required]],
      ubicacion_centro_trabajo: [this.gasto?.ubicacion_centro_trabajo],
      distancia_centroEd_centroTra: [this.gasto?.distancia_centroEd_centroTra, [Validators.min(0)]],
      distancia_centroEd_residencia: [this.gasto?.distancia_centroEd_residencia, [Validators.min(0)]],
      distancia_centroTra_residencia: [this.gasto?.distancia_centroTra_residencia, [Validators.min(0)]],
    });
  }

  get formulario() {
    return this.datosAlumno.controls;
  }

  /**
   * Método que se ejecutará al realizar la acción submit en el formulario
   * @returns `void`
   * @author David Sánchez Barragán
   */
  onSubmit() {
    this.submitted = true;

    //tipo_desplazamiento hay que modificarlo

    // residencia_alumno
    //   ubicacion_centro_trabajo
    //   distancia_centroEd_centroTra
    //   distancia_centroEd_residencia
    //   distancia_centroTra_residencia:
    let datos = this.datosAlumno.value;
    let gastoEditado = new Gasto(
      this.gasto?.dni_alumno,
      this.gasto?.curso_academico,
      '',
      0,
      datos.residencia_alumno,
      datos.ubicacion_centro_trabajo,
      datos.distancia_centroEd_centroTra,
      datos.distancia_centroEd_residencia,
      datos.distancia_centroTra_residencia,
      0,
      0,
      0,
      0
    );

    if (this.datosAlumno.invalid) {
      return;
    } else {
      this.modified = false;
      this.actualizarDatosGastoAlumno(gastoEditado);
      this.modalActive.close();
    }
  }

  /**
   * Método que se ejecutará al realizar la acción submit en el formulario
   * @returns `void`
   * @author David Sánchez Barragán
   */
  onChanges() {
    this.datosAlumno?.valueChanges.subscribe((val) => {
      if (!this.modified) {
        this.modified = true;
      }
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor

  /***********************************************************************/
  //#region Obtención de datos - READ

  /**
   * Obtiene los gastos del alumno del servidor y los establece al listener
   * @author David Sánchez Barragán
   */
  obtenerGastosAlumno() {
    let dniAlumno = '';
    this.route.queryParams.subscribe(params => {
      if (params['rol'] == 'Profesor') {
        dniAlumno = params['dni'];
      } else {
        dniAlumno = this.loginService.getUser()!.dni;
      }

      this.gestionGastosService
        .obtenerGastosAlumno(dniAlumno)
        .subscribe({
          next: (response) => {
            this.gestionGastosService.setGastoBS(response);
          }
        });
    });
  }



  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Obtención de datos - UPDATE

  /**
   * Cambia los datos del alumno en la base de datos
   * @param alumno Objeto con los datos del alumno
   * @author David Sánchez Barragán
   */
  actualizarDatosGastoAlumno(gasto: Gasto) {
    this.gestionGastosService.actualizarDatosGastoAlumno(gasto).subscribe({
      next: (reponse: any) => {
        this.toastr.success('Información de gastos actualizada correctamente');
        this.obtenerGastosAlumno();
      },
      error: (error) => {
        this.toastr.error('Se produjo un error al actualizar la información de gastos');
      },
    });
  }

  //#endregion
  /***********************************************************************/
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Establece el valor de todos los campos de distancia a cero.
   */
  public restablecerCampos() {
    this.formulario['ubicacion_centro_trabajo'].setValue('');
    this.formulario['distancia_centroEd_centroTra'].setValue('0');
    this.formulario['distancia_centroEd_residencia'].setValue('0');
    this.formulario['distancia_centroTra_residencia'].setValue('0');
  }

  /**
   * Método que se ejecutará al cerrar el modal
   * @returns `void`
   * @author David Sánchez Barragán
   */
  async closeModal() {
    if (!this.modified) {
      this.obtenerGastosAlumno();
      this.modalActive.close();
    } else {
      let guardar = await this.dialogService.confirmacion(
        'Guardar cambios',
        `Hay cambios sin guardar. ¿Quiere guardarlos antes de salir?`
      );
      if (guardar) {
        this.onSubmit();
      } else {
        this.obtenerGastosAlumno();
        this.modalActive.close();
      }
    }
  }

  //#endregion
  /***********************************************************************/
}
