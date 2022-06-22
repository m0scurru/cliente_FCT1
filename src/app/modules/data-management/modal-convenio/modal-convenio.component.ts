import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { CentroEstudios } from 'src/app/models/centroEstudios';
import { Convenio } from 'src/app/models/convenio';
import { Empresa } from 'src/app/models/empresa';
import { AuxService } from 'src/app/services/aux-service.service';
import { AnexoService } from 'src/app/services/crud-anexos.service';
import { CrudEmpresasService } from 'src/app/services/crud-empresas.service';
import { DatesService } from 'src/app/services/dates.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { RegistroEmpresaService } from 'src/app/services/registro-empresa.service';

@Component({
  selector: 'app-modal-convenio',
  templateUrl: './modal-convenio.component.html',
  styleUrls: ['./modal-convenio.component.scss'],
})
export class ModalConvenioComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables

  public empresa?: Empresa;
  public centro?: CentroEstudios;
  public convenio?: Convenio;
  public datos: FormGroup;
  public submitted: boolean = false;
  public modo?: number;
  public modified: boolean = false;
  public subir: boolean = false;
  public title: string = '';
  public tipo: string = '';
  public numConvenio: number = 0;
  public claseInput: string = '';
  public anexo?: any;

  constructor(
    private modalActive: NgbActiveModal,
    private crudEmpresasService: CrudEmpresasService,
    private storageUser: LoginStorageUserService,
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    public toastr: ToastrService,
    private auxService: AuxService,
    private datesService: DatesService,
    private registroEmpresaService: RegistroEmpresaService
  ) {
    this.datos = new FormGroup({});

    this.crudEmpresasService.empresaTrigger.subscribe({
      next: (data: Array<any>) => {
        this.empresa = data[0];
        this.centro = data[1];
        this.modo = data[2];
        this.tipo = this.empresa?.es_privada ? 'convenio' : 'acuerdo';
        this.claseInput =
          this.modo === 1 ? 'form-control-plaintext' : 'form-control';
        // Saco el convenio y su número
        if (this.empresa?.convenio) {
          this.convenio = this.empresa.convenio;
          let part = this.empresa.convenio.cod_convenio.split('/')[1];
          this.numConvenio = parseInt(part.substring(1));
        }

        this.construirFormulario();
      },
    });
  }

  ngOnInit(): void {
    switch (this.modo) {
      case 0:
        this.title = 'Hacer ';
        break;
      case 1:
        this.title = 'Ver ';
        break;
      case 2:
        this.title = 'Editar ';
        break;
      case 3:
        this.title = 'Renovar ';
        break;
    }
    if (this.empresa?.es_privada) {
      this.title += 'convenio';
    } else {
      this.title += 'acuerdo';
    }
    this.title += ' con ' + this.empresa?.nombre;
    this.onChanges();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión del formulario

  /***********************************************************************/
  //#region Construcción del formulario

  /**
   * Construye el formulario reactivo, cargando los datos del servidor
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private construirFormulario() {
    this.datos = this.formBuilder.group({
      //#region Convenio
      convenio: this.formBuilder.group({
        num_convenio: [
          this.numConvenio,
          [Validators.required, Validators.min(1)],
        ],
        cod_centro_convenio: [this.centro?.cod_centro_convenio],
        fecha_ini: [
          this.convenio ? this.convenio.fecha_ini : this.now,
          [Validators.required],
        ],
        fecha_fin: [
          this.convenio
            ? this.convenio.fecha_fin
            : this.datesService.dateToString(
                this.datesService.calcFechaFin(this.now)
              ),
        ],
        cod_convenio: [
          this.convenio
            ? this.convenio.cod_convenio
            : this.centro?.cod_centro_convenio +
              '/' +
              (this.empresa?.es_privada ? 'C' : 'A') +
              this.numConvenio +
              '/' +
              (new Date().getUTCFullYear() % 100),
          [],
        ],
      }),
      //#endregion
      //#region Anexo (archivo)
      anexo: [''],
      //#endregion
      //#region Director y centro de estudios
      director: this.formBuilder.group({
        nombre: [this.centro?.director?.nombre, [Validators.required]],
        apellidos: [this.centro?.director?.apellidos, [Validators.required]],
        dni: [
          this.centro?.director?.dni,
          [
            Validators.required,
            // Validators.minLength(9),
            // Validators.maxLength(9),
          ],
        ],
      }),
      centro: this.formBuilder.group({
        cod: [this.centro?.cod, [Validators.required]],
        nombre: [this.centro?.nombre, [Validators.required]],
        cif: [
          this.centro?.cif,
          [
            Validators.required,
            // Validators.minLength(9),
            // Validators.maxLength(9),
          ],
        ],
        provincia: [this.centro?.provincia, [Validators.required]],
        localidad: [this.centro?.localidad, [Validators.required]],
        direccion: [this.centro?.direccion, [Validators.required]],
        cp: [
          this.centro?.cp,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(5),
          ],
        ],
        email: [this.centro?.email, [Validators.required, Validators.email]],
        telefono: [this.centro?.telefono, [Validators.required]],
      }),
      //#endregion
      //#region Representante legal y empresa
      representante: this.formBuilder.group({
        nombre: [this.empresa?.representante?.nombre, [Validators.required]],
        apellidos: [
          this.empresa?.representante?.apellidos,
          [Validators.required],
        ],
        dni: [
          this.empresa?.representante?.dni,
          [
            Validators.required,
            // Validators.minLength(9),
            // Validators.maxLength(9),
          ],
        ],
      }),
      empresa: this.formBuilder.group({
        nombre: [this.empresa?.nombre, [Validators.required]],
        cif: [
          this.empresa?.cif,
          [
            Validators.required,
            // Validators.minLength(9),
            // Validators.maxLength(9),
          ],
        ],
        provincia: [this.empresa?.provincia, [Validators.required]],
        localidad: [this.empresa?.localidad, [Validators.required]],
        direccion: [this.empresa?.direccion, [Validators.required]],
        cp: [
          this.empresa?.cp,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(5),
          ],
        ],
        email: [this.empresa?.email, [Validators.required, Validators.email]],
        telefono: [this.empresa?.telefono, [Validators.required]],
      }),
      //#endregion
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Getters

  /**
   * Obtiene los controles del formulario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  get formulario(): any {
    return this.datos.controls;
  }

  /**
   * Obtiene los controles de la sección de convenio del formulario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  get formConvenio() {
    return this.formulario.convenio.controls;
  }

  /**
   * Obtiene los controles de la sección del director del formulario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  get formDirector() {
    return this.formulario.director.controls;
  }

  /**
   * Obtiene los controles de la sección del centro de estudios del formulario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  get formCentro() {
    return this.formulario.centro.controls;
  }

  /**
   * Obtiene los controles de la sección del representante legal del formulario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  get formRepresentante() {
    return this.formulario.representante.controls;
  }

  /**
   * Obtiene los controles de la sección de la empresa del formulario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  get formEmpresa() {
    return this.formulario.empresa.controls;
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Submits

  /**
   * Valida el formulario y redirige al método adecuado, según
   * se esté en modo de creación, visualización, edición o renovación
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  onSubmit() {
    this.submitted = true;

    if (!this.datos.valid) return;

    // Añado algunos datos que faltan para el servidor
    this.datos.value.convenio.cod_centro = this.centro?.cod;
    this.datos.value.convenio.id_empresa = this.empresa?.id;
    this.datos.value.empresa.es_privada = this.empresa?.es_privada;
    this.datos.value.subir_anexo = this.subir;
    this.datos.value.anexo = this.anexo;

    switch (this.modo) {
      case 0:
        this.onSubmitAdd();
        break;
      case 1:
        this.downloadAnexo(this.convenio?.ruta_anexo);
        break;
      case 2:
        this.onSubmitEdit();
        break;
      case 3:
        this.onSubmitRenovar;
        break;
    }
  }

  /**
   * Envía una petición al servidor para guardar los datos del convenio
   * y generar el documento o subirlo, según haya elegido el usuario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private onSubmitAdd(): void {
    this.crudEmpresasService.addConvenio(this.datos.value).subscribe({
      next: async (response: any) => {
        this.empresa!.convenio = this.datos.value.convenio;
        this.toastr.success(
          `El ${this.tipo} con ${this.empresa?.nombre} se ha registrado correctamente`,
          `Registro del ${this.tipo}`
        );
        //#region Descarga opcional del anexo
        if (!this.subir) {
          let descargar = await this.dialogService.confirmacion(
            'Anexo generado',
            `¿Quiere descargar el Anexo 0 ${
              this.empresa?.es_privada ? '' : 'A'
            } de ${this.tipo} con ${this.empresa?.nombre}?`
          );
          if (descargar) {
            this.downloadAnexo(response.ruta_anexo);
          }
        }
        //#endregion
        this.closeModal();
      },
      error: (e) => {
        let title = `Error de registro del ${this.tipo}`;
        let msg = `Error al registrar el ${this.tipo} con ${this.empresa?.nombre}`;
        if (e.status == 409) {
          title = `Código de ${this.tipo} duplicado'`;
          msg = `Utilice otro número de ${this.tipo}`;
        }
        this.toastr.error(msg, title);
      },
    });
  }

  /**
   * Envía una petición al servidor para modificar los datos del convenio
   * y re-generar el documento o subirlo, según haya elegido el usuario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private onSubmitEdit(): void {
    if (this.convenio?.cod_convenio != this.datos.value.convenio.cod_convenio) {
      this.datos.value.convenio.cod_convenio_anterior =
        this.convenio?.cod_convenio;
    }
    this.crudEmpresasService.editConvenio(this.datos.value).subscribe({
      next: async (response) => {
        this.empresa!.convenio = this.datos.value.convenio;
        this.toastr.success(
          `El ${this.tipo} con ${this.empresa?.nombre} se ha modificado correctamente`,
          `Modificación del ${this.tipo}`
        );
        this.modified = false;
        //#region Descarga opcional del anexo
        if (!this.subir) {
          let descargar = await this.dialogService.confirmacion(
            'Anexo generado',
            `¿Quiere descargar el Anexo 0 ${
              this.empresa?.es_privada ? '' : 'A'
            } de ${this.tipo} con ${this.empresa?.nombre}?`
          );
          if (descargar) {
            this.downloadAnexo(response.ruta_anexo);
          }
        }
        //#endregion
        this.closeModal();
      },
      error: (e) => {
        let title = `Error de modificación del ${this.tipo}`;
        let msg = `Error al modificar el ${this.tipo} con ${this.empresa?.nombre}`;
        if (e.status == 409) {
          title = `Código de ${this.tipo} duplicado'`;
          msg = `Utilice otro número de ${this.tipo}`;
        }
        this.toastr.error(msg, title);
      },
    });
  }

  private onSubmitRenovar(): void {}

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de cambios y eventos

  /**
   * Detecta los cambios en el formulario y, si hay, pone una variable bandera a true
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  onChanges(): void {
    this.datos.valueChanges.subscribe((val) => {
      if (!this.modified) {
        this.modified = true;
      }
    });
  }

  /**
   * Establece el valor del número del convenio y actualiza el código del convenio
   *
   * @param event
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  changeNumConvenio(event: any) {
    let num = event.target.value;
    this.numConvenio = num;
    this.formConvenio['num_convenio'].setValue(num);
    this.formConvenio['cod_convenio'].setValue(
      this.construirCodConvenio(
        this.datos.value.convenio.cod_centro_convenio,
        num,
        this.datos.value.convenio.fecha_ini
      )
    );
  }

  /**
   * Establece el valor de la fecha de inicio del convenio,
   * actualizando tanto la fecha de fin (+4 años) como el código del convenio
   *
   * @param event
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  changeFechaConvenio(event: any) {
    let fecha = event.target.value;
    this.formConvenio['fecha_ini'].setValue(fecha);
    this.formConvenio['fecha_fin'].setValue(
      this.datesService.dateToString(this.datesService.calcFechaFin(fecha))
    );
    this.formConvenio['cod_convenio'].setValue(
      this.construirCodConvenio(
        this.datos.value.convenio.cod_centro_convenio,
        this.datos.value.convenio.num_convenio,
        fecha
      )
    );
  }

  /**
   * Establece la variable subir al valor del checkbox corresponsiente
   *
   * @param event
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public changeSubir(event: any) {
    this.subir = event.target.checked;
  }

  /**
   * Establece como valor del control 'anexo' del formulario
   * la cadena en Base64 del fichero
   *
   * @param event
   * @author David Sánchez Barragán
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public async cargarAnexo(event: any) {
    let file = event.target.files[0];
    if (file) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        this.anexo = fileReader.result;
      };
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor

  /**
   * Descarga el anexo si la ruta es válida. Si no, imprime un mensaje de error
   *
   * @param ruta ruta del anexo en el servidor
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public downloadAnexo(ruta?: string): void {
    if (ruta) {
      this.registroEmpresaService.descargarAnexo0(ruta).subscribe({
        next: (response) => {
          let arr = ruta.split('\\', 3);
          let nombre = arr.pop();
          const blob = new Blob([response], {
            type: 'application/octet-stream',
          });
          FileSaver.saveAs(blob, nombre);
          this.toastr.success('Descargando anexo');
        },
        error: (err) => {
          if (err.status === 404) {
            this.toastr.error(
              'Vuelva a subir o a generar el anexo en la opción de editar',
              'Anexo no encontrado'
            );
          } else {
            this.toastr.error(
              'No se ha podido descargar el anexo',
              'Error del servidor'
            );
          }
        },
      });
    } else {
      this.toastr.error(
        'Vuelva a subir o a generar el anexo en la opción de editar',
        'Anexo no encontrado'
      );
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Cierra el modal sólo si no hay cambios sin guardar
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  async closeModal() {
    this.crudEmpresasService.empresaBS.next(this.empresa);
    if (!this.modified || this.modo != 2) {
      this.modalActive.close();
    } else {
      let guardar = await this.dialogService.confirmacion(
        'Guardar cambios',
        `Hay cambios sin guardar. ¿Quiere guardarlos antes de salir?`
      );
      if (guardar) {
        this.onSubmit();
      }
      this.modalActive.close();
    }
  }

  /**
   * Devuelve la fecha de hoy en string
   *
   * @returns `string` fecha de hoy en formato 'yyyy-mm-dd'
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  get now(): string {
    return this.datesService.now;
  }

  /**
   * Construye el código del convenio a partir de distintas variables
   *
   * @param codCentro Código específico del centro para los convenios
   * @param num Número asociado al convenio
   * @param fecha Fecha en la que se da inicio el convenio
   * @returns El código de convenio fabricado
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private construirCodConvenio(
    codCentro: string,
    num: number,
    fecha: string | Date
  ) {
    let cod: string =
      codCentro + '/' + (this.empresa?.es_privada ? 'C' : 'A') + num + '/';
    if (fecha instanceof Date) {
      cod += fecha.getUTCFullYear() % 100;
    } else if (typeof fecha === 'string') {
      cod += this.datesService.stringToDate(fecha).getUTCFullYear() % 100;
    }
    return cod;
  }

  //#endregion
  /***********************************************************************/
}
