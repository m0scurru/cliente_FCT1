import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../models/alumno';
import { Empresa } from '../../../models/empresa';
import { Router } from '@angular/router';
import { AsociarAlumnoEmpresaService } from '../../../services/asociar-alumno-empresa.service';
import { ModalUploadAnexoComponent } from '../modal-upload-anexo/modal-upload-anexo.component';
import { AnexoService } from 'src/app/services/crud-anexos.service';
import { ToastrService } from 'ngx-toastr';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import * as FileSaver from 'file-saver';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { DialogService } from 'src/app/services/dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManualAsigAlumComponent } from '../../manuales/manual-asig-alum/manual-asig-alum.component';

@Component({
  selector: 'app-asociar-emp-alu',
  templateUrl: './asociar-emp-alu.component.html',
  styleUrls: ['./asociar-emp-alu.component.scss'],
})
export class AsociarEmpAluComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables

  usuario;
  alumnos: Alumno[] = [];
  empresas: Empresa[] = [];
  anexos: any;
  respuesta: any = [];
  nombreCiclo: string = '';
  dniTutor?: string;
  hayAlumnosEnEmpresas: any;

  constructor(
    private alumnosEmpresas: AsociarAlumnoEmpresaService,
    private router: Router,
    private toastr: ToastrService,
    private storageUser: LoginStorageUserService,
    private anexoService: AnexoService,
    public dialogService: DialogService,
    private modal: NgbModal
  ) {
    this.usuario = storageUser.getUser();
    this.dniTutor = this.usuario?.dni;
    this.hayAlumnosEnEmpresas = false;
  }

  ngOnInit(): void {
    this.getNombreCiclo();
    this.getAlumnos();
    this.getEmpresas();
    this.getAnexos();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funcionalidad principal: drag and drop

  /**
   * Esta función se encarga de hacer el drag and drop de los alumnos.
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @param event
   */
  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor

  /***********************************************************************/
  //#region Obtención de información: alumnos, empresas, nombre del ciclo, anexos

  /**
   * Esta función se encarga de obtener los alumnos del tutor logueado del servidor.
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @param event
   */
  getAlumnos(): void {
    this.alumnosEmpresas
      .solicitarAlumnos(this.dniTutor!)
      .subscribe((resultado) => {
        this.alumnos = resultado;
      });
  }

  /**
   * Esta función se encarga de obtener los anexos si estos existen
   * @author Laura <lauramorenoramos97@gmail.com>
   * @param event
   */
  getAnexos(): void {
    this.alumnosEmpresas
      .solicitarAnexosFct(this.dniTutor!)
      .subscribe((resultado) => {
        this.anexos = resultado;
      });
  }

  /**
   * Esta función se encarga de obtener las empresas con sus alumnos asignados del tutor logueado del servidor.
   * this.hayAlumnosEnEmpresas mira si hay alumnos en la empresa, por que así afirmamos que el tutor ya tiene
   * generado un anexo con sus uniones entre alumnos y empresas ya establecidas
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @param event
   */
  getEmpresas(): void {
    this.alumnosEmpresas
      .solicitarEmpresas(this.dniTutor!)
      .subscribe({
        next:(resultado) => {
          this.empresas=resultado;
        this.empresas.forEach((element) => {
          if (element.alumnos?.length! > 0) {
            this.hayAlumnosEnEmpresas = true;
          }
        });
      },
      error: (e) => {
        console.log(e);
        this.toastr.error('error', 'La información no se ha podido recuperar');
      }
      });
  }

  /**
   * Esta función se encarga de obtener el nombre del curso el tutor logueado.
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @param event
   */
  getNombreCiclo(): void {
    this.alumnosEmpresas.solicitarNombreCiclo(this.dniTutor!).subscribe({
      next: (response: any) => {
        this.nombreCiclo = response;
      },
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Guardar cambios y descargar Anexo(s) I

  /**
   * Esta función se encarga de enviar los cambios a la base de datos
   * y comprueba que todos los datos sean correctos antes de enviar los cambios al server.
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   * @param event
   */
  async setCambiosEmpresas() {
    let hacerlo = await this.dialogService.confirmacion(
      'Asignar',
      `¿Está seguro de que desea asignar los alumnos?`
    );
    if (hacerlo) {
      var bandera = true;
      var menor = true;
      var msg = '';
      this.empresas.forEach((empresa) => {
        if (empresa.nombre_responsable && bandera) {
          empresa.alumnos?.forEach((alumno) => {
            if (
              !alumno.fecha_fin ||
              !alumno.fecha_ini ||
              !alumno.horario ||
              !menor
            ) {
              bandera = false;
            }
            if (alumno.fecha_ini! >= alumno.fecha_fin! || (!bandera && menor)) {
              menor = false;
              msg += `${alumno.nombre} tiene la fecha de inicio mayor que la fecha de fin.\n`;
            }
          });
        } else {
          bandera = false;
        }
      });
      if (bandera && menor) {
        var datos = {
          empresas: this.empresas,
          alumnos_solos: this.alumnos,
          dni_tutor: this.dniTutor,
        };
        this.alumnosEmpresas.asignarAlumnos(datos).subscribe({
          next:(response) =>{
            this.toastr.success('Cambios realizados con exito.', 'Guardado');
            this.getNombreCiclo();
            this.getAlumnos();
            this.getEmpresas();
            this.getAnexos();
          },
          error:(e) =>{
            this.toastr.error(e.error.message,'Fallo!');
            this.getNombreCiclo();
            this.getAlumnos();
            this.getEmpresas();
            this.getAnexos();
          }
        });
      } else if (!bandera) {
        this.toastr.error(
          'No pueden haber campos vacíos, o las fechas son incorrectas',
          'Rellena campos'
        );
      }
      if (msg != '') {
        this.toastr.error(msg, 'Fechas incorrectas');
      }
    } else {
      this.toastr.info(
        'Has decidido no asignar los alumnos',
        'No Asignados'
      );
    }
  }

  /**
   * @author Laura <lauramorenoramos97@gmail.com>
   * Esta funcion te permite descargar los anexos que se han generado
   */
  GenerarAnexos() {
    this.alumnosEmpresas.generarAnexo(this.dniTutor!).subscribe({
      next: (res) => {
        const current = new Date();
        const blob = new Blob([res], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, 'backup_' + current.getTime() + '.zip');
        this.toastr.success('Anexo generado correctamente', 'Generado!');
        this.getNombreCiclo();
        this.getAlumnos();
        this.getEmpresas();
        this.getAnexos();
      },
      error: (e) => {
        this.toastr.error('El anexo no ha podido generarse', 'Fallo!');
      },
    });
    this.router.navigate(['/data-management/asig-alum-empresa']);
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Abre un modal de ayuda
   * @author Alvaro <alvarosantosmartin6@gmail.com>
   */
  public abrirAyuda(): void {
    this.modal.open(ManualAsigAlumComponent, { size: 'lg' });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones descarga y subida
  /**
   * Esta funcion abre el manual de ayuda del crud de anexos, almacena en sessionStorage
   * el nombre del archivo correcto y el tipo de Anexo
   * @author Laura <lauramorenoramos97@gmail.com>
   */
  public abrirModalUpload(codigo: string) {
    sessionStorage.setItem('tipoAnexo', 'Anexo1');
    sessionStorage.setItem('codigoAnexo',codigo);
    this.modal.open(ModalUploadAnexoComponent, { size: 'md' });
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
      this.anexoService.descargarAnexo(this.dniTutor!, codigo).subscribe({
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
      this.router.navigate(['/data-management/asig-alum-empresa']);
    } else {
      this.toastr.info('No has descargado el anexo', 'Descarga');
    }
  }
  //#endregion
  /***********************************************************************/
}
