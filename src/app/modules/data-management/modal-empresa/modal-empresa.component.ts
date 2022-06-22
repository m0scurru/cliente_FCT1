import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/models/empresa';
import { Trabajador } from 'src/app/models/trabajador';
import { CrudEmpresasService } from 'src/app/services/crud-empresas.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';

@Component({
  selector: 'app-modal-empresa',
  templateUrl: './modal-empresa.component.html',
  styleUrls: ['./modal-empresa.component.scss'],
})
export class ModalEmpresaComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables y formulario

  public empresa: Empresa | undefined;
  public editar: boolean | undefined;
  public datosEmpresa: FormGroup;
  public submitted: boolean = false;
  public modified: boolean = false;
  public empresas: Empresa[] = [];
  public usuario;

  constructor(
    private modalActive: NgbActiveModal,
    private crudEmpresasService: CrudEmpresasService,
    private storageUser: LoginStorageUserService,
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    public toastr: ToastrService
  ) {
    this.usuario = storageUser.getUser();
    this.datosEmpresa = this.formBuilder.group({});

    this.crudEmpresasService.empresaTrigger.subscribe({
      next: (data: Array<any>) => {
        this.empresa = data[0];
        this.editar = data[1];

        this.construirFormulario();
        console.log(this.datosEmpresa.value.es_privada);
      },
    });
  }

  ngOnInit(): void {
    this.getEmpresas();
    this.onChanges();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión del formulario

  get formulario() {
    return this.datosEmpresa.controls;
  }

  /**
   * Construye el formulario reactivo
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  construirFormulario() {
    this.datosEmpresa = this.formBuilder.group({
      cif: [
        this.empresa?.cif,
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      nombre_empresa: [this.empresa?.nombre, [Validators.required]],
      telefono: [this.empresa?.telefono, [Validators.required]],
      email_empresa: [
        this.empresa?.email,
        [Validators.required, Validators.email],
      ],
      es_privada: [this.empresa?.es_privada],
      provincia: [this.empresa?.provincia, [Validators.required]],
      localidad: [this.empresa?.localidad, [Validators.required]],
      cp: [
        this.empresa?.cp,
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
      direccion: [this.empresa?.direccion, [Validators.required]],
      nombre_representante: [
        this.empresa?.representante?.nombre,
        [Validators.required],
      ],
      apellidos: [
        this.empresa?.representante?.apellidos,
        [Validators.required],
      ],
      dni: [
        this.empresa?.representante?.dni,
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      email_representante: [
        this.empresa?.representante?.email,
        [Validators.required],
      ],
    });
  }

  /**
   * Detecta los cambios en el formulario y, si hay, pone una variable bandera a true
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  onChanges(): void {
    this.datosEmpresa.valueChanges.subscribe((val) => {
      if (!this.modified) {
        this.modified = true;
      }
    });
  }

  public changeEsPrivada(event: any): void {
    this.formulario['es_privada'].setValue(event.target.value);
  }

  /**
   * Valida el formulario con los datos introducidos
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  onSubmit() {
    this.submitted = true;
    let datos = this.datosEmpresa.value;
    let representanteEditado = new Trabajador(
      datos.dni,
      datos.email_representante,
      datos.nombre_representante,
      datos.apellidos,
      this.empresa?.id!
    );

    let empresaEditada = new Empresa(
      this.empresa?.id!,
      datos.cif,
      datos.nombre_empresa,
      datos.email_empresa,
      datos.telefono,
      datos.localidad,
      datos.provincia,
      datos.direccion,
      datos.cp,
      representanteEditado
    );
    empresaEditada.es_privada = datos.es_privada;

    if (this.datosEmpresa.invalid) {
      return;
    } else {
      this.modified = false;
      this.updateEmpresa(empresaEditada);
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor

  /***********************************************************************/
  //#region Obtención de datos - Empresas, representantes

  /**
   * Inicializa las empresas del componente mediante el servicio correspondiente
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getEmpresas(): void {
    this.crudEmpresasService.getEmpresas(this.usuario?.dni!).subscribe({
      next: async (empresas) => {
        this.empresas = empresas;
        this.crudEmpresasService.getEmpresasArray(this.empresas);
      },
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Actualización de datos - Empresas, representantes

  /**
   * Actualiza los datos de la empresa en la base de datos
   * @param empresa La empresa a actualizar
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  updateEmpresa(empresa: Empresa) {
    this.crudEmpresasService.updateEmpresa(empresa).subscribe({
      next: async (response: any) => {
        this.empresa = empresa;
        await this.updateRepresentante(empresa.representante!);
        this.empresa.representante = empresa.representante;
        this.toastr.success(response.message, response.title);
        this.modified = false;
        this.closeModal();
      },
      error: (err: any) => {
        this.toastr.error(err.error.message, err.error.title);
      },
    });
  }

  /**
   * Actualiza el representante legal de una empresa
   * @param representante El representante legal de la empresa
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  async updateRepresentante(representante: Trabajador) {
    this.crudEmpresasService.updateRepresentante(representante).subscribe({
      next: (response: any) => {
        this.empresa!.representante = representante;
        this.toastr.success(response.message, response.title);
      },
      error: (err: any) => {
        this.toastr.error(err.error.message, err.error.title);
      },
    });
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Cierra el modal sólo si no hay cambios sin guardar
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
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
      }
      this.modalActive.close();
    }
  }

  //#endregion
  /***********************************************************************/
}
