import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FacturaTransporte } from 'src/app/models/facturaTransporte';
import { ModoEdicion } from 'src/app/models/modoEdicion';
import { AuxService } from 'src/app/services/aux-service.service';
import { DialogService } from 'src/app/services/dialog.service';
import { GestionGastosService } from 'src/app/services/gestion-gastos.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';

@Component({
  selector: 'app-modal-ticket-desplazamiento',
  templateUrl: './modal-ticket-desplazamiento.component.html',
  styleUrls: ['./modal-ticket-desplazamiento.component.scss'],
})
export class ModalTicketDesplazamiento implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables y formulario

  public facturaTransporte?: FacturaTransporte;
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
    public toastr: ToastrService
  ) {
    this.datosFactura = this.formBuilder.group({});

    this.gestionGastosService.facturaTransporteTrigger.subscribe({
      next: (data: Array<any>) => {
        this.facturaTransporte = data[0];
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
      id: [this.facturaTransporte?.id, []],
      dni_alumno: [this.facturaTransporte?.dni_alumno, []],
      curso_academico: [this.facturaTransporte?.curso_academico, []],
      fecha: [this.facturaTransporte?.fecha, []],
      importe: [this.facturaTransporte?.importe, []],
      origen: [this.facturaTransporte?.origen, []],
      destino: [this.facturaTransporte?.destino, []],
      imagen_ticket: [this.facturaTransporte?.imagen_ticket, []]
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
      facturaPeticion = new FacturaTransporte(
        0,
        this.dni,
        '',
        this.formulario['fecha'].value,
        this.formulario['importe'].value,
        this.formulario['origen'].value,
        this.formulario['destino'].value,
        this.formulario['imagen_ticket'].value
      );
    } else {
      facturaPeticion = new FacturaTransporte(
        this.facturaTransporte?.id,
        this.facturaTransporte?.dni_alumno,
        this.facturaTransporte?.curso_academico,
        this.formulario['fecha'].value,
        this.formulario['importe'].value,
        this.formulario['origen'].value,
        this.formulario['destino'].value,
        this.formulario['imagen_ticket'].value
      );
    }



    if (this.datosFactura.invalid) {
      return;
    } else {
      this.modified = false;
      if (this.modo == ModoEdicion.nuevo) {
        this.nuevaFacturaTransporte(facturaPeticion);
      } else {
        this.actualizarFacturaTransporte(facturaPeticion);
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
   * Inserta los datos del ticket de transporte en la base de datos
   * @param alumno Objeto con los datos del ticket
   * @author David Sánchez Barragán
   */
  nuevaFacturaTransporte(factura: FacturaTransporte) {
    this.gestionGastosService.nuevaFacturaTransporte(factura).subscribe({
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
  actualizarFacturaTransporte(factura: FacturaTransporte) {
    this.gestionGastosService.actualizarFacturaTransporte(factura).subscribe({
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
