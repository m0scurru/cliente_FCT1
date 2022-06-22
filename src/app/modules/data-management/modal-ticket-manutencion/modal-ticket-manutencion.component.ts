import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FacturaManutencion } from 'src/app/models/facturaManutencion';
import { ModoEdicion } from 'src/app/models/modoEdicion';
import { AuxService } from 'src/app/services/aux-service.service';
import { DialogService } from 'src/app/services/dialog.service';
import { GestionGastosService } from 'src/app/services/gestion-gastos.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';

@Component({
  selector: 'app-modal-ticket-manutencion',
  templateUrl: './modal-ticket-manutencion.component.html',
  styleUrls: ['./modal-ticket-manutencion.component.scss'],
})
export class ModalTicketManutencion implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables y formulario

  public facturaManutencion?: FacturaManutencion;
  public datosFactura: FormGroup;
  public submitted: boolean = false;
  public modified: boolean = false;
  public modosEdicion: typeof ModoEdicion = ModoEdicion;
  public modo?: number;
  public dni?: string;
  //UI
  public required: string = '';
  public readonly: boolean = false;
  public titulo: string = '';

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
    this.datosFactura = this.formBuilder.group({});

    this.gestionGastosService.facturaManutencionTrigger.subscribe({
      next: (data: Array<any>) => {
        this.facturaManutencion = data[0];
        this.modo = data[1];
        this.dni = data[2];

        this.construirFormulario();

        //UI
        this.required = 'required';
        this.readonly = !(this.modo == this.modosEdicion.editar || this.modo == this.modosEdicion.nuevo);
        switch (this.modo) {
          case ModoEdicion.detalle:
            this.titulo = 'Detalle';
            break;
          case ModoEdicion.editar:
            this.titulo = 'Editar';
            break;
          case ModoEdicion.nuevo:
            this.titulo = 'Nuevo';
            break;
        }
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
    this.datosFactura = this.formBuilder.group({
      id: [this.facturaManutencion?.id, []],
      dni_alumno: [this.facturaManutencion?.dni_alumno, []],
      curso_academico: [this.facturaManutencion?.curso_academico, []],
      fecha: [this.facturaManutencion?.fecha, []],
      importe: [this.facturaManutencion?.importe, []],
      imagen_ticket: [this.facturaManutencion?.imagen_ticket, []]
    });
  }

  get formulario() {
    return this.datosFactura.controls;
  }

  /**
   * Método que se ejecutará al realizar la acción submit en el formulario
   * @returns `void`
   * @author David Sánchez Barragán
   */
  onSubmit() {
    this.submitted = true;

    let facturaPeticion = null;
    if (this.modo == ModoEdicion.nuevo) {
      facturaPeticion = new FacturaManutencion(
        0,
        this.dni,
        '',
        this.formulario['fecha'].value,
        this.formulario['importe'].value,
        this.formulario['imagen_ticket'].value
      );
    } else {
      facturaPeticion = new FacturaManutencion(
        this.facturaManutencion?.id,
        this.facturaManutencion?.dni_alumno,
        this.facturaManutencion?.curso_academico,
        this.formulario['fecha'].value,
        this.formulario['importe'].value,
        this.formulario['imagen_ticket'].value
      );
    }



    if (this.datosFactura.invalid) {
      return;
    } else {
      this.modified = false;
      if (this.modo == ModoEdicion.nuevo) {
        this.nuevaFacturaManutencion(facturaPeticion);
      } else {
        this.actualizarFacturaManutencion(facturaPeticion);
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
    this.datosFactura?.valueChanges.subscribe((val) => {
      if (!this.modified) {
        this.modified = true;
      }
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor


  //#region Creación de datos - CREATE
  /**
   * Inserta los datos del ticket de Manutencion en la base de datos
   * @param alumno Objeto con los datos del ticket
   * @author David Sánchez Barragán
   */
  nuevaFacturaManutencion(factura: FacturaManutencion) {
    this.gestionGastosService.nuevaFacturaManutencion(factura).subscribe({
      next: (reponse: any) => {
        this.toastr.success('Ticket insertado correctamente');
        this.obtenerGastosAlumno();
      },
      error: (error) => {
        this.toastr.error('Se produjo un error al insertar el ticket');
      },
    });
  }
  //#endregion

  /***********************************************************************/
  //#region Obtención de datos - READ

  /**
   * Obtiene los gastos del alumno del servidor y los establece al listener
   * @author David Sánchez Barragán
   */
  obtenerGastosAlumno() {
    this.gestionGastosService
      .obtenerGastosAlumno(this.dni)
      .subscribe({
        next: (response) => {
          this.gestionGastosService.setGastoBS(response);
        }
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
  actualizarFacturaManutencion(factura: FacturaManutencion) {
    this.gestionGastosService.actualizarFacturaManutencion(factura).subscribe({
      next: (reponse: any) => {
        this.toastr.success('Cambios guardados correctamente');
        this.obtenerGastosAlumno();
      },
      error: (error) => {
        this.toastr.error('Se produjo un error al actualizar el ticket');
      },
    });
  }

  /**
   * Cambia la imagen en el elemento <img> del html y en el FormBuilder
   * @param event Evento change del input type=file de la imagen del ticket
   * @param formulario Formulario para asignar el contenido en base64 del fichero
   */
  cambiarImagenTicket(event: any, formulario: any) {
    let files = event.target.files[0];
    if (files) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.onload = function () {
        let element: any = document.getElementById('imagen_ticket');
        element.src = this.result;
        formulario['imagen_ticket'].setValue(this.result)
      };
    }
  }

  //#endregion
  /***********************************************************************/
  /***********************************************************************/

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
