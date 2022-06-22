import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddComponent } from './modal-add/modal-add.component';
import { ModalEditarComponent } from './modal-editar/modal-editar.component';
import { Jornada } from '../../../models/Jornada/jornada';
import { ModalJornadaService } from '../../../services/modal-jornada.service';
import { SeguimientoServiceService } from 'src/app/services/seguimiento-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/services/dialog.service';
import { ModalCambiotutorComponent } from './modal-cambiotutor/modal-cambiotutor.component';
import { ManualAnexo3Component } from '../../manuales/manual-anexo3/manual-anexo3.component';
import { FileUploadModel } from 'src/app/models/file-upload.model';
import { ModalSubirficheroComponent } from './modal-subirfichero/modal-subirfichero.component';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss'],
})
export class SeguimientoComponent implements OnInit {

  usuario;
  public arrayJornadas: any = [];
  public dni_alumno?: string;
  public nombre_alumno: any;
  public nombre_empresa: any;
  public departamento: any;
  public departamentoEstablecido: boolean = false;
  deptoForm: FormGroup;
  submitted: boolean = false;
  public horasTotales: number = 0;
  public botonDescargar: boolean = false;
  public botonVer: boolean = false;
  public static readonly id_empresa: string = 'id_empresa';
  public tutor_empresa: string = '';
  public arraySemanas: any = [];
  public totalSemanas: number = 0;
  public static readonly id_fct: string = 'id_fct';
  public static readonly id_quinto_dia: string = 'id_quinto_dia';

  // public fileToUpload: File


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private modal: NgbModal,
    private modalJornadaService: ModalJornadaService,
    private seguimientoService: SeguimientoServiceService,
    private storageUser: LoginStorageUserService,
    private toastr: ToastrService,
    public dialogService: DialogService,

  ) {
    this.usuario = storageUser.getUser();
    this.dni_alumno = this.usuario?.dni;
    this.deptoForm = this.formBuilder.group({
      depto: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.arrayJornadas = this.rellenarArray();
    this.ponerNombre();
    this.recogerTutorEmpresa();
    this.gestionDepartamento();
    this.sumatorioHorasTotales();
    this.getArrayJornadas();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de las cabeceras

  get formulario() {
    return this.deptoForm.controls;
  }

  /**
   * Método que recoge el tutor que tiene asignado el alumno en la empresa.
   * @author Malena
   */
  public recogerTutorEmpresa() {
    this.seguimientoService.recogerTutorEmpresa(this.dni_alumno!).subscribe({
      next: (response: any) => {
        this.tutor_empresa = response[0];
        /*La empresa a la que pertenece el alumno, me la llevo al modal de cambiar tutor para poder
          sacar los tutores/responsables de dicha empresa:*/
        let id_empresa = response[1];
        sessionStorage.setItem(
          SeguimientoComponent.id_empresa,
          JSON.stringify(id_empresa)
        );
      },
      error: (e) => {
        this.toastr.error(
          'No se ha podido recoger el tutor empresa.',
          'Error al recoger el tutor'
        );
      },
    });
  }

  /**
   * Este método escribe el nombre del alumno y el nombre de la empresa en la interfaz.
   * @author Malena
   */
  public ponerNombre() {
    this.seguimientoService.escribirDatos(this.dni_alumno!).subscribe({
      next: (response: any) => {
        this.nombre_alumno =
          response[0]['nombre_alumno'] + ' ' + response[0]['apellidos_alumno'];
        this.nombre_empresa = response[0]['nombre_empresa'];
      },
      error: (e) => {
        this.toastr.error(
          'No se ha podido mostrar ni el nombre del alumno ni de la empresa.',
          'Error al mostrar datos'
        );
      },
    });
  }

  /**
   * Este método controla si el Departamento que le corresponde al alumno está establecido en la BBDD o no.
   * La interfaz cambiará dependiendo de si está establecido el valor o no.
   * @author Malena
   */
  public gestionDepartamento() {
    this.seguimientoService.gestionarDepartamento(this.dni_alumno!).subscribe({
      next: (response: any) => {
        if (response[0]['departamento'] != '') {
          this.departamentoEstablecido = true;
          this.departamento = response[0]['departamento'];
        } else {
          this.departamentoEstablecido = false;
        }
      },
      error: (e) => {
        this.toastr.error(
          'No se ha podido mostrar el departamento.',
          'Error al mostrar departamento'
        );
      },
    });
  }

  /**
   * Este método recoge el valor del Departamento y se añade a la BBDD en la tabla FCT de
   * su correspondiente alumno.
   * @author Malena
   */
  public guardarDepartamento() {
    this.submitted = true;
    if (!this.deptoForm.valid) return;
    this.departamento = this.deptoForm.value.depto;

    this.seguimientoService
      .addDepartamento(this.dni_alumno!, this.departamento)
      .subscribe({
        next: (response: any) => {
          this.departamentoEstablecido = true;
        },
        error: (e) => {
          this.toastr.error(
            'No se ha podido añadir el departamento.',
            'Error al añadir departamento'
          );
        },
      });
  }

  /**
   * Este método se encarga de recoger el sumatorio de las horas totales que el alumno ha estado
   * haciendo en la empresa, y lo establece en la interfaz.
   * @author Malena.
   */
  public sumatorioHorasTotales() {
    this.seguimientoService.sumatorioHorasTotales(this.dni_alumno!).subscribe({
      next: (response: any) => {
        this.horasTotales = response;
      },
      error: (e) => {
        this.toastr.error(
          'No se ha podido mostrar las horas totales.',
          'Error al mostrar horas totales'
        );
      },
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de las jornadas

  /**
   * Con este metodo recojo el array de las jornadas directamente del modal para que se actualice
   * la tabla de las jornadas al insertar una nueva, sin necesidad de recargar la pagina.
   * @author Malena.
   */
  public getArrayJornadas() {
    this.modalJornadaService.jornadasArray.subscribe((response) => {
      this.arrayJornadas = response;
      this.totalSemanas = this.arrayJornadas.length;
      var cuantasJornadasHay = this.arrayJornadas.length;
      this.sumatorioHorasTotales();
      this.devolverSemanas();


      //Cuando se inserten 5 nuevas jornadas, se habilita el boton Descargar PDF:
      if (cuantasJornadasHay >= 5 && cuantasJornadasHay % 5 == 0) {
        this.botonDescargar = true;
        this.botonVer = false;
      }

      //Cuando haya más de 5 jornadas añadidas, se mostrará el boton Ver PDF:
      if (cuantasJornadasHay > 5 && cuantasJornadasHay % 5 != 0) {
        this.botonVer = true;
        this.botonDescargar = false;
      }
    });
  }

  /**
   * Metodo que recoge las jornadas que le corresponden al alumno y las muestra por pantalla.
   * @returns arrayJornada, las jornadas que tiene el alumno.
   * @author Malena.
   */
  public rellenarArray() {
    this.seguimientoService.devolverJornadas(this.dni_alumno!).subscribe({
      next: (response: any) => {
        this.arrayJornadas = response;
        this.totalSemanas = this.arrayJornadas.length;
        this.devolverSemanas();
      },
      error: (e) => {
        this.toastr.error(
          'No se han podido mostrar las jornadas.',
          'Error al mostrar jornadas'
        );
      },
    });
    return this.arrayJornadas;
  }

  /**
   * Función que agrupa las jornadas del alumnno por semanas en el servidor,
   * y devuelve al array montado para mostrarlo en el cliente.
   * @author Malena
   */
  public devolverSemanas() {
    this.seguimientoService.devolverSemanas(this.dni_alumno!).subscribe({
      next: (response: any) => {
        this.arraySemanas = response;
        /*
        si la ultima semana tiene menos de 5 dias, es decir, no esta completa, no tendremos la información de las firmas(tabla "semana"), asique
        añadimos una semana vacía en el arraySemanas, para que la semana incompleta hace referencia a la semana[0] y la semana completa a la semana[1]
        */
        if (this.arrayJornadas[this.arrayJornadas.length - 1].length < 5) {
          //La semana no está completa:
          var semanaVacia = {};
          this.arraySemanas.unshift(semanaVacia);
        }
      }
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Invocación de modales y otros

  /**
   * Método que abre un modal para seleccionar el nuevo tutor del alumno en la empresa.
   * @author Malena
   */
  public modalCambiarTutor() {
    this.modal.open(ModalCambiotutorComponent, { size: 'xs' });
  }

  /**
   * Mostrará un modal para rellenar los campos para poder insertar un nuevo registro en el seguimiento.
   * @author Malena
   */
  nuevaJornada() {
    this.modal.open(ModalAddComponent, { size: 'm' });
  }

  /**
   * Este metodo sirve para abrir el modal en la jornada correspondiente que se ha pulsado,
   * para poder editar sus datos y actualizarlos en la BBDD.
   * @author Malena
   */
  public editar(jornada: Jornada) {
    this.modal.open(ModalEditarComponent, { size: 'm' });
    this.modalJornadaService.jornadaTrigger.emit(jornada);
  }

  /**
   * Método para abrir el manual del anexo3.
   * @author Malena
   */
  public abrirAyuda() {
    this.modal.open(ManualAnexo3Component, { size: 'lg' });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Descarga de Anexo(s) III

  /**
   * Método que abre el Modal Dialog y depende de la respuesta hace una cosa u otra, en este
   * caso descargaría la hoja de seguimiento correspondiente.
   * @author Malena
   */
  public async generarDocumento(semana: any) {
    if (Object.keys(semana).length == 0) {
      this.toastr.error(
        'No puedes descargar el documento sin añadir primero 5 jornadas.',
        'Error al descargar el documento'
      );
    } else {
      if (this.departamentoEstablecido == false) {
        this.toastr.error(
          'No puedes descargar el documento sin añadir el departamento.',
          'Error al descargar el documento'
        );
      } else {
        let descargar = await this.dialogService.confirmacion(
          'Generar Word Anexo III',
          'Se ha generado tu hoja de seguimiento, ¿Quiere descargarla? (Se eliminarán las firmas registradas)'
        );
        if (descargar) {
          this.seguimientoService.generarDocumento(semana.id_quinto_dia, this.dni_alumno!).subscribe({
            next: (res: any) => {
              const blob = new Blob([res], { type: 'application/octet-stream' });
              var hoy = new Date(Date.now());
              var nombre = 'Hoja_seguimiento_' + this.dni_alumno + '_' + hoy.toISOString() + '.docx';
              FileSaver.saveAs(blob, nombre);
              // location.reload();
              this.toastr.success(
                'Se ha descargado la hoja de seguimiento correctamente.',
                'Generación de Anexo III'
              );
            },
            error: (e) => {
              this.toastr.error(
                'No se ha podido generar el documento correctamente.',
                'Error en la generación del Anexo III'
              );
            },
          });
        }
      }
    }
  }

  /**
   * Función que desccarga el PDF de una semana en concreto.
   * @param semana
   * @author Malena
   */
  public async descargarPDF(semana: any) {
    this.seguimientoService.hayDocumento(semana.id_quinto_dia, semana.id_fct).subscribe({
      next: (response: any) => {
        let ruta_hoja = response.ruta_hoja;
        if (ruta_hoja != "" && ruta_hoja != null) {
          var ruta = ruta_hoja.split("\\").pop();
          // console.log(ruta);
          this.seguimientoService.descargarPDF(ruta_hoja).subscribe({
            next: (res: any) => {
              const blob = new Blob([res], { type: 'application/octet-stream' });
              FileSaver.saveAs(blob, ruta);
              this.toastr.success(
                'Se ha descargado la hoja de seguimiento en PDF correctamente.',
                'Descarga PDF de Anexo III'
              );
            }
          })
        } else {
          this.toastr.error(
            'No se ha podido descargar el PDF debido a que no se generado y subido un archivo previamente.',
            'Error en la descarga del PDF del Anexo III'
          );
        }
      }
    })
  }



  /**
   * Método para que la semana de arriba se  muestre abierta nada más entrar y no salga comprimida
   * @author Malena
   * @returns clase
   */
  public mostrarSemana(i: number) {
    var clase = "accordion-collapse collapse";
    if (i == 0) {
      clase = "accordion-collapse collapse show";
    }
    return clase;
  }

  /**
   * Función que abre el modal determinado para subir el Anexo III de una determinada semana.
   * @param semana
   * @author Malena
   */
  public abrirModalSubirArchivo(semana: any) {
    let id_fct = semana.id_fct;
    let id_quinto_dia = semana.id_quinto_dia;
    sessionStorage.setItem(SeguimientoComponent.id_fct, id_fct);
    sessionStorage.setItem(SeguimientoComponent.id_quinto_dia, id_quinto_dia);
    if (Object.keys(semana).length == 0) {
      this.toastr.error(
        'No puedes subir el documento sin añadir primero 5 jornadas.',
        'Error al subir el documento'
      );
    } else {
      this.modal.open(ModalSubirficheroComponent, { size: 's', });
    }
  }


  /***********************************************************************/
  //#region Gestión de firmas del Anexo(s) III

  /**
   * Función que determina cuándo tiene que mostrarse el tick de firmado_alumno
   * @param semana
   * @returns mostrar, boolean para definir si se muestra o no el tick de firmado_alumno
   * @author Malena
   */
  public mostrarCheckAlumno(semana: any) {
    var mostrar = false;
    if (semana != undefined && semana.firmado_alumno == 1) {
      mostrar = true;
    }
    return mostrar;
  }

  /**
   * Función que determina cuándo tiene que mostrarse el tick de firmado_tutor_estudios
   * @param semana
   * @returns mostrar, boolean para definir si se muestra o no el tick de firmado_tutor_estudios
   * @author Malena
   */
  public mostrarCheckTutorEstudios(semana: any) {
    var mostrar = false;
    if (semana != undefined && semana.firmado_tutor_estudios == 1) {
      mostrar = true;
    }
    return mostrar;
  }

  /**
   * Función que determina cuándo tiene que mostrarse el tick de firmado_tutor_empresa
   * @param semana
   * @returns mostrar, boolean para definir si se muestra o no el tick de firmado_tutor_empresa
   * @author Malena
   */
  public mostrarCheckTutorEmpresa(semana: any) {
    var mostrar = false;
    if (semana != undefined && semana.firmado_tutor_empresa == 1) {
      mostrar = true;
    }
    return mostrar;
  }
  //#endregion
  /***********************************************************************/
}
