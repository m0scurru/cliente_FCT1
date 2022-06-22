import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Alumno } from 'src/app/models/alumno';
import { Grupo } from 'src/app/models/grupo';
import { ModoEdicion } from 'src/app/models/modoEdicion';
import { AuxService } from 'src/app/services/aux-service.service';
import { CrudAlumnosService } from 'src/app/services/crud-alumnos.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';

@Component({
  selector: 'app-modal-alumno',
  templateUrl: './modal-alumno.component.html',
  styleUrls: ['./modal-alumno.component.scss'],
})
export class ModalAlumnoComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables y formulario

  public alumno?: Alumno;
  public modosEdicion: typeof ModoEdicion = ModoEdicion;
  public modo?: number;
  public datosAlumno: FormGroup;
  public listadoProvincias?: string[];
  public listadoCiudades?: string[];
  public listadoGrupos?: Grupo[];
  public listadoAlumnos?: Alumno[];
  public submitted: boolean = false;
  public modified: boolean = false;
  public nombre_curriculum: string = '';
  public fotoPorDefecto = './assets/images/defaultProfilePicture.png';

  constructor(
    private modalActive: NgbActiveModal,
    private crudAlumnosService: CrudAlumnosService,
    private auxService: AuxService,
    private loginService: LoginStorageUserService,
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    public toastr: ToastrService
  ) {
    this.datosAlumno = this.formBuilder.group({});

    this.crudAlumnosService.alumnoTrigger.subscribe({
      next: (data: Array<any>) => {
        this.alumno = data[0];
        this.modo = data[1];
        this.construirFormulario();
        this.obtenerListaGrupos();
        this.obtenerListaProvincias();
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
      cod_alumno: [
        this.alumno?.cod_alumno,
        [Validators.required, Validators.min(0)],
      ],
      dni: [this.alumno?.dni, [Validators.required]],
      email: [this.alumno?.email, [Validators.required, Validators.email]],
      password: [
        this.alumno?.password,
        this.modo !== this.modosEdicion.nuevo ? [] : [Validators.required],
      ],
      nombre: [this.alumno?.nombre, [Validators.required]],
      apellidos: [this.alumno?.apellidos, [Validators.required]],
      provincia: [this.alumno?.provincia, [Validators.required]],
      localidad: [this.alumno?.localidad, [Validators.required]],
      va_a_fct: [parseInt(this.alumno?.va_a_fct + '') != 0],
      matricula_cod: [this.alumno?.matricula_cod, [Validators.required]],
      matricula_cod_grupo: [
        this.alumno?.matricula_cod_grupo,
        [Validators.required],
      ],
      foto: [this.alumno?.foto],
      curriculum: [this.alumno?.curriculum],
      cuenta_bancaria: [this.alumno?.cuenta_bancaria],
      matricula_coche: [this.alumno?.matricula_coche],
      fecha_nacimiento: [this.alumno?.fecha_nacimiento],
      domicilio: [this.alumno?.domicilio],
      telefono: [this.alumno?.telefono],
      movil: [this.alumno?.movil],
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

    let datos = this.datosAlumno.value;
    let alumnoEditado = new Alumno(
      datos.nombre,
      datos.dni,
      datos.va_a_fct ? 1 : 0,
      '',
      new Date(),
      new Date(),
      datos.cod_alumno,
      datos.email,
      datos.apellidos,
      datos.password,
      datos.provincia,
      datos.localidad,
      this.alumno?.dni,
      datos.matricula_cod,
      this.alumno?.matricula_cod_centro,
      datos.matricula_cod_grupo,
      datos.foto,
      datos.curriculum,
      datos.cuenta_bancaria,
      datos.matricula_coche,
      datos.fecha_nacimiento,
      datos.domicilio,
      datos.telefono,
      datos.movil
    );

    if (this.datosAlumno.invalid) {
      return;
    } else {
      this.modified = false;

      if (this.modo == this.modosEdicion.nuevo) {
        this.registrarAlumno(alumnoEditado);
      } else {
        this.actualizarAlumno(alumnoEditado);
      }

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
   * Obtiene los grupos asociados a un centro de estudios
   * @author David Sánchez Barragán
   */
  obtenerListaGrupos() {
    this.crudAlumnosService.listarGrupos().subscribe({
      next: (respuesta) => {
        if (this.modo == this.modosEdicion.nuevo) {
          this.listadoGrupos = [new Grupo('', 'Seleccione uno...')];
          this.listadoGrupos = this.listadoGrupos.concat(respuesta);
        } else {
          this.listadoGrupos = respuesta;
        }
      },
    });
  }

  /**
   * Obtiene las provincias de la base de datos
   * @author David Sánchez Barragán
   */
  obtenerListaProvincias() {
    this.auxService.listarProvincias().subscribe({
      next: (respuesta) => {
        if (this.modo != this.modosEdicion.detalle) {
          this.listadoProvincias = ['Seleccione uno...'];
          this.listadoProvincias = this.listadoProvincias.concat(respuesta);
        } else {
          this.listadoProvincias = [''];
          this.listadoProvincias = this.listadoProvincias.concat(respuesta);
        }

        if (this.modo != this.modosEdicion.nuevo) {
          this.obtenerListaCiudades(this.alumno?.provincia!);
        }
      },
    });
  }

  /**
   * Obtiene una lista de municipios filtrando por provincia
   * @param provincia provincia por la que se filtra
   * @author David Sánchez Barragán
   */
  obtenerListaCiudades(provincia: string) {
    this.auxService.listarCiudades(provincia).subscribe({
      next: (repuesta) => {
        this.listadoCiudades = repuesta;
      },
    });
  }

  /**
   * Obtiene los alumnos del servidor
   * @author David Sánchez Barragán
   */
  obtenerAlumnos() {
    this.crudAlumnosService
      .listarAlumnos(this.loginService.getUser()?.dni)
      .subscribe({
        next: (response) => {
          this.crudAlumnosService.setAlumnosArray(response);
        },
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
  actualizarAlumno(alumno: Alumno) {
    this.crudAlumnosService.actualizarAlumno(alumno).subscribe({
      next: (reponse: any) => {
        this.toastr.success('Alumno actualizado correctamente');
        this.obtenerAlumnos();
      },
      error: (error) => {
        this.toastr.error('Se produjo un error al actualizar al alumno');
      },
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Alta de datos - CREATE

  /**
   * Registra un alumno en la base de datos
   * @param alumno Objecto con los datos del alumno
   * @author David Sánchez Barragán
   */
  registrarAlumno(alumno: Alumno) {
    this.crudAlumnosService.registrarAlumno(alumno).subscribe({
      next: (response: any) => {
        this.toastr.success('Alumno registrado correctamente');
        this.obtenerAlumnos();
      },
      error: (error) => {
        this.toastr.success('Se produjo un error al registrar al alumno');
      },
    });
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Suscripción a cambios: provincia, ciudad, grupo, FCT, foto, curriculum

  /**
   * Cambia la provincia y refresca las localidades
   * @param event
   * @author David Sánchez Barragán
   */
  cambiarProvincia(event: any) {
    this.formulario['provincia'].setValue(event.target.value);
    this.obtenerListaCiudades(event.target.value);
  }

  /**
   * Cambia la ciudad
   * @param event
   * @author David Sánchez Barragán
   */
  cambiarCiudad(event: any) {
    this.formulario['localidad'].setValue(event.target.value);
  }

  /**
   * Cambia el grupo de matriculación
   * @param event
   * @author David Sánchez Barragán
   */
  cambiarGrupo(event: any) {
    this.formulario['matricula_cod_grupo'].setValue(event.target.value);
  }

  /**
   * Cambia si el alumno va o no a FCT
   * @param event
   * @author David Sánchez Barragán
   */
  cambiarVaAFCT(event: any) {
    this.formulario['va_a_fct'].setValue(event.target.checked);
  }

  /**
   * Cambia la imagen en el elemento <img> del html y en el FormBuilder
   * @param event Evento change del input type=file de la foto de perfil
   * @param formulario Formulario para asignar el contenido en base64 del fichero
   */
  cambiarFoto(event: any, formulario: any) {
    let files = event.target.files[0];
    if (files) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.onload = function () {
        let element: any = document.getElementById('foto');
        element.src = this.result;
        formulario['foto'].setValue(this.result)
      };
    }
  }

  /**
   * Cambia el curriculum del alumno en el FormBuilder
   * @param event Evento change del input type=file del curriculum
   * @param formulario Formulario para asignar el contenido en base64 del fichero
   */
  cambiarCurriculum(event: any, formulario: any) {
    let files = event.target.files[0];
    if (files) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.addEventListener("load", function () {
        formulario['curriculum'].setValue(this.result);
      });
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Método que se ejecutará al cerrar el modal
   * @returns `void`
   * @author David Sánchez Barragán
   */
  async closeModal() {
    if (!this.modified) {
      this.modalActive.close();
    } else {
      let guardar = await this.dialogService.confirmacion(
        'Guardar cambios',
        `Hay cambios sin guardar. ¿Quiere guardarlos antes de salir?`
      );
      if (guardar) {
        this.onSubmit();
      } else {
        this.modalActive.close();
      }
    }
  }

  /**
   * Abre la foto de perfil en una nueva pestaña del navegador
   * @param event URL de la imagen en el lado servidor
   */
  public abrirFoto(url: any) {
    window.open(url);
  }

  /**
   * Descarga el currículum del alumno
   * @param url URL del servidor del CV del alumno
   */
  public descargarCV(dni: string) {
    if (this.formulario['curriculum'].value.length > 0) {
      this.crudAlumnosService.descargarCurriculum(dni).subscribe({
        next: (res: any) => {
          const blob = new Blob([res], { type: 'application/octet-stream' });
          FileSaver.saveAs(blob, `CV${this.formulario['dni'].value}.pdf`);
        },
        error: (e) => {
          this.toastr.error('El curriculum no ha podido descargarse', 'Error');
        },
      });
    } else {
      this.toastr.warning('No existe curriculum para este usuario');
    }
  }

  public descargarAnexoFEM05(dni: string) {
    this.crudAlumnosService.descargarAnexoFEM05(dni)
    .subscribe({
      next: (res: any) => {
        const blob = new Blob([res], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `AnexoFEM05_${this.alumno?.nombreCompleto}.docx`);
      },
      error: (e) => {
        this.toastr.error('El anexo no ha podido descargarse', 'Error');
      },
    });
  }

  //#endregion
  /***********************************************************************/
}
