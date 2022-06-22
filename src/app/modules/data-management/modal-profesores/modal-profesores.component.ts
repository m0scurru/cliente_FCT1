import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudProfesoresService } from 'src/app/services/crud-profesores.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProfesorCreate } from 'src/app/models/profesores/profesorCreate';
import { ToastrService } from 'ngx-toastr';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';

@Component({
  selector: 'app-modal-profesores',
  templateUrl: './modal-profesores.component.html',
  styleUrls: ['./modal-profesores.component.scss'],
})
export class ModalProfesoresComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables y formulario

  public profesor: any = [];
  public numero: any;
  public roles: any = [];
  public profesoresArray: any = [];
  submitted: boolean = false;
  dni?: string;
  usuario;
  datosProfesor: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalActive: NgbActiveModal,
    private profesorService: CrudProfesoresService,
    private toastr: ToastrService,
    private storageUser: LoginStorageUserService
  ) {
    this.numero = sessionStorage.getItem('numPeticion');

    this.usuario = storageUser.getUser();
    this.dni = this.usuario?.dni;

    this.datosProfesor = this.formBuilder.group({
      dni: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      password1: ['', [Validators.required, Validators.pattern]],
      password2: ['', [Validators.required, Validators.pattern]],
    });
  }

  ngOnInit(): void {
    if (this.numero == '0') {
      this.verProfesor();
    } else {
      if (this.numero == '2') {
        this.verProfesorEdit();
      }
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión del formulario

  get formulario() {
    return this.datosProfesor.controls;
  }
  /**
   * Esta funcion edita los values de los campos del formulario cuando llega la información
   * para asi poder ver al usuario y posteriormente editarlo.
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public updateForm() {
    this.datosProfesor.controls['dni'].setValue(this.profesor[0].dni);
    this.datosProfesor.controls['email'].setValue(this.profesor[0].email);
    this.datosProfesor.controls['nombre'].setValue(this.profesor[0].nombre);
    this.datosProfesor.controls['apellido'].setValue(
      this.profesor[0].apellidos
    );
    this.datosProfesor.controls['password1'].setValue(
      this.profesor[0].password1
    );
    this.datosProfesor.controls['password2'].setValue(
      this.profesor[0].password2
    );

    let rolesAux = document.querySelectorAll(
      '#rolesUsers input'
    ) as NodeListOf<HTMLInputElement>;

    this.profesor[0].roles.forEach((r: number) => {
      rolesAux.forEach((element: { checked: any; value: string }) => {
        if (element) {
          let elemento = parseInt(element.value);
          if (r == elemento) {
            element.checked = true;
          }
        }
      });
    });
  }

  /**
   * Esta funcion edita a un profesor, recorre los valores de los roles de un array de
   * inputs, los almacena en otro array que es parseado para que sean numeros, y asi
   * poder enviarse al servidor, para que pueda modificar los roles
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public onSubmitEdit() {
    this.submitted = true;
    if (this.datosProfesor.invalid) return;

    this.roles = document.querySelectorAll(
      '#rolesUsers input'
    ) as NodeListOf<HTMLInputElement>;
    let rolesAux: any = [];
    let i: number = 0;
    let hayAlMenosUnRol = false;

    this.roles.forEach((element: { checked: any; value: string }) => {
      if (element.checked) {
        hayAlMenosUnRol = true;
        rolesAux[i] = parseInt(element.value);
        i++;
      }
    });

    if (hayAlMenosUnRol == false) {
      this.toastr.error('Tienes que poner un rol como minimo', 'Fallo');
    } else {
      let dniAnt: any = sessionStorage.getItem('dniAnt');
      let usuario = new ProfesorCreate(
        this.datosProfesor.value.dni,
        this.datosProfesor.value.email,
        this.datosProfesor.value.nombre,
        this.datosProfesor.value.apellido,
        this.datosProfesor.value.password1,
        this.datosProfesor.value.password2,
        rolesAux,
        dniAnt
      );

      this.profesorService.editarUser(usuario).subscribe({
        next: () => {
          this.toastr.success('Profesor Editado', 'Logrado!');
          this.recogerProfesores();
          this.CloseModal();
        },
        error: (e) => {
          this.toastr.error('Error al editar', 'Error');
        },
      });
    }
  }

  /**
   * Esta funcion Crea a un profesor
   * @author Laura <lauramorenoramos@gmail.com>
   */
  onSubmitCreate() {
    let i: number = 0;
    let rolesAux: any = [];
    let hayAlMenosUnRol = false;

    this.submitted = true;
    if (this.datosProfesor.invalid) return;

    //PARA RECOGER LOS ROLES
    this.roles = document.querySelectorAll(
      '#rolesUsers input'
    ) as NodeListOf<HTMLInputElement>;

    this.roles.forEach((element: { checked: any; value: string }) => {
      if (element.checked) {
        hayAlMenosUnRol = true;
        rolesAux[i] = parseInt(element.value);
        i++;
      }
    });

    if (hayAlMenosUnRol == false) {
      this.toastr.error('Tienes que poner un rol como minimo', 'Fallo');
    } else {
      let usuario = new ProfesorCreate(
        this.datosProfesor.value.dni,
        this.datosProfesor.value.email,
        this.datosProfesor.value.nombre,
        this.datosProfesor.value.apellido,
        this.datosProfesor.value.password1,
        this.datosProfesor.value.password2,
        rolesAux,
        this.dni
      );

      this.profesorService.registrarProfesor(usuario).subscribe({
        next: () => {
          this.toastr.success('Profesor Creado', 'Logrado!');
          this.recogerProfesores();
          this.CloseModal();
        },
        error: (e) => {
          this.toastr.error('El profesor no ha podido crearse', 'Fallo');
        },
      });
    }
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Servicios - Peticiones al servidor
  /**
   * Esta funcion nos permite ver un profesor
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public verProfesor() {
    const dni_profesor: any = sessionStorage.getItem('dniProfesor');
    this.profesorService.getProfesor(dni_profesor).subscribe((response) => {
      this.profesor = response;
    });
  }

  /**
   * Esta funcion permite ver a un profesor, al que le llegan unos parametros especificos,
   * almacena en una sesion el dni del antiguo profesor que va a ser editado, para poder
   * enviarlo al servidor y asi poder editar desde la base de datos, también llama a una funcion
   * para que, cuando verProfesor edit sea llamada, la respuesta de esta permita editar
   * los campos del formulario y asi poder ver los datos del profesor a editar.
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public verProfesorEdit() {
    const dni_profesor: any = sessionStorage.getItem('dniProfesor');
    this.profesorService.getProfesorEdit(dni_profesor).subscribe((response) => {
      this.profesor = response;
      sessionStorage.setItem('dniAnt', this.profesor[0].personaAux);
      this.updateForm();
    });
  }

  /**
   * Esta funcion recoge  el nuevo array actualizado de profesores para darselo
   * a la ventana principal y que se muestre actualizada
   * @author Laura <lauramorenoramos@gmail.com>
   */
  public recogerProfesores() {
    this.profesorService.getProfesores(this.dni!).subscribe({
      next: (response: any) => {
        this.profesoresArray = response;
        this.profesorService.getProfesoresInArray(this.profesoresArray);
      },
      error: (e) => {
        this.toastr.error('Los profesores no han podido mostrarse', 'Fallo');
      },
    });
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Esta funcion te permite cerrar un modal con la cruz situada arriba a la derecha
   * @author Laura <lauramorenoramos@gmail.com>
   */
  CloseModal() {
    this.modalActive.dismiss();
  }

  //#endregion
  /***********************************************************************/
}
