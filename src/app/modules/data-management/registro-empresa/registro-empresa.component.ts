import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FaseForm } from 'src/app/classes/fase-form';
import { FamiliaProfesional } from 'src/app/models/familiaProfesional';
import { Grupo } from 'src/app/models/grupo';
import { AuxService } from 'src/app/services/aux-service.service';
import { CrudEmpresasService } from 'src/app/services/crud-empresas.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { RegistroEmpresaService } from 'src/app/services/registro-empresa.service';
import { ManualRegistroEmpresasComponent } from '../../manuales/manual-registro-empresas/manual-registro-empresas.component';
import { ModalConvenioComponent } from '../modal-convenio/modal-convenio.component';

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.scss'],
})
export class RegistroEmpresaComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización del componente

  public fases: Array<FaseForm>;
  public faseActual: number;
  public submitted: boolean = false;

  public empresa!: FormGroup;
  private datosEmpresa: any;
  public ubicacion!: FormGroup;
  public provincias!: string[];
  public localidades?: string[];
  public representante!: FormGroup;
  private datosRepresentante: any;
  public familias!: FamiliaProfesional[];
  public grupos?: Grupo[];
  public familiaSelected?: number;
  public ciclos!: FormGroup;
  private datosCiclos: any;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private auxService: AuxService,
    private storage: LoginStorageUserService,
    private registroEmpresa: RegistroEmpresaService,
    private toastr: ToastrService,
    public dialog: DialogService,
    private router: Router,
    private crudEmpresasService: CrudEmpresasService
  ) {
    this.fases = new Array<FaseForm>(5);
    this.faseActual = 1;

    this.construirFormularios();

    this.getProvincias();

    this.getFamilias();
    this.getGrupos();
  }

  ngOnInit(): void {
    this.inicializarFases();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de formularios

  /***********************************************************************/
  //#region Construcción de formularios

  /**
   * Contruye los formularios del registro: empresa, ubicación,
   * datos del representante legal y ciclos formativos
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private construirFormularios(): void {
    this.construirFormEmpresa();
    this.construirFormUbicacion();
    this.construirFormRepresentante();
    this.construirFormCiclos();
  }

  /**
   * Construye el formulario de datos de la empresa
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private construirFormEmpresa(): void {
    this.empresa = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      telefono: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      cif: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      tipoEmpresa: ['', [Validators.required]],
    });
  }

  /**
   * Construye el formulario de datos de ubicación del centro de trabajo
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private construirFormUbicacion(): void {
    this.ubicacion = this.formBuilder.group({
      localidad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      cp: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
    });
  }

  /**
   * Construye el formulario de datos del representante legal
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private construirFormRepresentante(): void {
    this.representante = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      dni: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
    });
  }

  /**
   * Construye el formulario de solicitud de ciclos formativos por parte de la empresa
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public construirFormCiclos(): void {
    this.ciclos = this.formBuilder.group({
      cod_ciclos_selected: this.formBuilder.array([], [Validators.required]),
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Getters

  get formEmpresa() {
    return this.empresa.controls;
  }

  get formUbicacion() {
    return this.ubicacion.controls;
  }

  get formRepresentante() {
    return this.representante.controls;
  }

  get formCiclos() {
    return this.ciclos.controls;
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de cambios y eventos

  /**
   * Cambia la provincia y refresca las localidades
   *
   * @param event
   * @author David Sánchez Barragán
   */
  cambiarProvincia(event: any) {
    this.formUbicacion['provincia'].setValue(event.target.value);
    this.getLocalidades(event.target.value);
  }

  /**
   * Cambia la ciudad
   *
   * @param event
   * @author David Sánchez Barragán
   */
  cambiarCiudad(event: any) {
    this.formUbicacion['localidad'].setValue(event.target.value);
  }

  /**
   * Cambia la familia profesional, filtrando los ciclos
   *
   * @param event
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  cambiarFamilia(event: any) {
    this.familiaSelected = parseInt(event.target.value);
  }

  /**
   * Gestiona el marcado de checkbox de la selección de ciclos
   *
   * @param event
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  onCheckboxChange(event: any) {
    const checkArray: FormArray = this.ciclos.get(
      'cod_ciclos_selected'
    ) as FormArray;
    if (event.target.checked) {
      checkArray.push(new FormControl(event.target.value));
      console.table(this.ciclos.value);
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item) => {
        if (item.value == event.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Submits

  /**
   * Valida el formulario de datos de la empresa y guarda la información
   * si cumple con las validaciones
   *
   * @author Malena
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  onSubmitEmpresa(): void {
    this.submitted = true;

    if (!this.empresa.valid) return;

    this.datosEmpresa = this.empresa.value;

    this.nextFase();
    this.submitted = false;
  }

  /**
   * Valida el formulario de datos de ubicación del centro de trabajo
   * y guarda la información si cumple con las validaciones
   *
   * @author Malena
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  onSubmitUbicacion(): void {
    this.submitted = true;
    if (!this.ubicacion.valid) return;

    let datosUbicacion = this.ubicacion.value;
    this.datosEmpresa.localidad = datosUbicacion.localidad;
    this.datosEmpresa.provincia = datosUbicacion.provincia;
    this.datosEmpresa.direccion = datosUbicacion.direccion;
    this.datosEmpresa.cp = datosUbicacion.cp;

    this.nextFase();
    this.submitted = false;
  }

  /**
   * Valida el formulario de datos de ubicación del centro de trabajo
   * y guarda la información si cumple con las validaciones
   *
   * @author Malena
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  onSubmitRepresentante(): void {
    this.submitted = true;
    if (!this.representante.valid) return;

    this.datosRepresentante = this.representante.value;

    this.nextFase();
    this.submitted = false;
  }

  /**
   * Valida el formulario de solicitud de ciclos formativos
   * por parte de la empresa
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  onSubmitCiclos(): void {
    this.submitted = true;
    if (!this.ciclos.valid) return;

    this.datosCiclos = this.ciclos.value;

    this.nextFase();
    this.submitted = false;
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor

  /***********************************************************************/
  //#region Inserción de datos - Create

  public finalizarRegistro(): void {
    var datos = {
      empresa: this.datosEmpresa,
      representante: this.datosRepresentante,
      ciclos: this.datosCiclos.cod_ciclos_selected,
      dni: this.storage.getUser()?.dni,
    };

    this.registroEmpresa.enviarDatos(datos).subscribe({
      next: (response: any) => {
        this.toastr.success(
          'Datos guardados correctamente.',
          'Registro de empresa.'
        );
        this.askConvenio();
      },
      error: (e) => {
        this.toastr.error(
          'No se han guardado los datos correctamente.',
          'Error al registrar empresa'
        );
      },
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Obtención de datos - Read

  /**
   * Obtiene las provincias de la base de datos
   *
   * @author David Sánchez Barragán
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private getProvincias(): void {
    this.auxService.listarProvincias().subscribe({
      next: (respuesta) => {
        this.provincias = ['Seleccione una...'];
        this.provincias = this.provincias.concat(respuesta);
      },
    });
  }

  /**
   * Obtiene una lista de municipios filtrando por provincia
   * @param provincia provincia por la que se filtra
   *
   * @author David Sánchez Barragán
   */
  private getLocalidades(provincia: string): void {
    this.auxService.listarCiudades(provincia).subscribe({
      next: (response) => {
        this.localidades = response;
      },
    });
  }

  /**
   * Obtiene una lista de las familias profesionales del sistema
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private getFamilias(): void {
    this.auxService.getFamilias().subscribe({
      next: (response) => {
        this.familias = [
          new FamiliaProfesional(0, 'Todas las familias profesionales'),
        ];
        this.familias = this.familias.concat(response);
      },
    });
  }

  /**
   * Obtiene una lista de todos los grupos de ciclos en el sistema.
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private getGrupos(): void {
    this.auxService.getGrupos().subscribe({
      next: (response) => {
        this.grupos = response;
      },
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Auxiliares - Check duplicidados

  /**
   * Envía una petición al servidor para comprobar si un un elemento está registrado en la BBDD
   *
   * @param elemento nombre del objeto que se quiere comprobar
   * (corresponde un una tabla en la BBDD). Ejemplo: 'empresa'
   * @param campo nombre del campo a comprobar. Ejemplo: 'email'
   * @param event
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public checkDato(elemento: string, campo: string, event: any): void {
    if (event.target.value) {
      this.registroEmpresa
        .checkDatos(elemento, campo, event.target.value)
        .subscribe({
          next: (res) => {
            if (res) {
              switch (elemento) {
                case 'empresa':
                  this.empresa.controls[campo].setErrors({ duplicate: true });
                  break;
                case 'trabajador':
                  this.representante.controls[campo].setErrors({
                    duplicate: true,
                  });
                  break;
              }
            }
          },
        });
    }
  }

  //#endregion
  /***********************************************************************/

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de las fases del registro

  /**
   * Inicializa las fases del formulario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public inicializarFases() {
    for (let i = 0; i < this.fases.length; i++) {
      let nombre: string = '';
      let abreviatura: string = '';
      switch (i + 1) {
        case 1:
          nombre = 'Empresa';
          abreviatura = nombre;
          break;
        case 2:
          nombre = 'Ubicación';
          abreviatura = nombre;
          break;
        case 3:
          nombre = 'Representante legal';
          abreviatura = 'Rpte. legal';
          break;
        case 4:
          nombre = 'Ciclos formativos';
          abreviatura = 'Ciclos';
          break;
        case 5:
          nombre = 'Resumen';
          abreviatura = nombre;
          break;
      }
      this.fases[i] = new FaseForm(i + 1, nombre, abreviatura);
    }
    this.fases[0].activar();
  }

  /**
   * Devuelve una fase del formulario
   *
   * @param i `number` Index de la fase que se quiere obtener
   * @returns `FaseForm` Fase del formulario
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private getFase(i: number): FaseForm {
    return this.fases.find((fase) => fase.index === i)!;
  }

  /**
   * Cambia de fase siempre y cuando ésta sea accesible
   *
   * @param index Valor numérico de la fase a la que se cambia
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public cambiarFase(index: number): void {
    if (this.getFase(index).accesible) {
      this.faseActual = index;
    }
  }

  /**
   * Avanza en uno la fase actual y la activa
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public nextFase(): void {
    this.faseActual++;
    this.getFase(this.faseActual).activar();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Filtra los grupos según la familia profesional
   * Recibe 0 como parámetro si se quieren obtener todos los grupos
   *
   * @param familia ID de la familia profesional, 0 si no se filtra
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  filtrarGrupos(familia: number) {
    switch (familia) {
      case 0:
        return this.grupos;
      case undefined:
        return this.grupos;
      default:
        return this.grupos!.filter((grupo) => {
          return grupo.familias!.some((fam) => fam.id === familia);
        });
    }
  }

  /**
   * Devuelve un objeto de grupo a partir de su código
   * @param cod código del grupo
   * @returns `Grupo` correspondiente al código
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getGrupo(cod: string) {
    return this.grupos?.find((grupo) => grupo.cod === cod);
  }

  /**
   * Comprueba si un grupo está seleccionado
   * @param cod Código del grupo
   * @returns true si está seleccionado, false si no
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isChecked(cod: string) {
    return this.ciclos.value.cod_ciclos_selected.includes(cod);
  }

  /**
   * Abre un modal de ayuda
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public abrirAyuda(): void {
    this.modal.open(ManualRegistroEmpresasComponent, { size: 'lg' });
  }

  /**
   * Invoca un modal en el que se pregunta al usuario si quiere establecer convenio / acuerdo con esa empresa
   * En caso afirmativo, se invoca otro modal en el que se pregunta si se quiere hacer automático o manual
   * En caso negativo, navega a la vista del CRUD de empresas
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  private async askConvenio() {
    let hacerlo = await this.dialog.confirmacion(
      'Establecer Convenio / Acuerdo',
      'Se ha registrado correctamente ' +
        this.datosEmpresa.nombre +
        '. ¿Quiere establecer los datos del convenio ahora? Puede hacerlo más adelante en Gestión de Empresas'
    );
    if (!hacerlo) {
      this.router.navigateByUrl('data-management/gestion-empresas');
    } else {
      this.dialog.dialog.closeAll();
      this.modal.open(ModalConvenioComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
      });
      this.crudEmpresasService.getEmpresa(this.datosEmpresa.cif).subscribe({
        next: (empresa) => {
          this.crudEmpresasService.empresaTrigger.emit([
            empresa,
            this.storage.getUser()?.centro,
            0,
          ]);
          this.router.navigateByUrl('data-management/gestion-empresas');
        },
      });
    }
  }

  //#endregion
  /***********************************************************************/
}
