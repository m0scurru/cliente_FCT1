import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { catchError, first, Subscription, throwError } from 'rxjs';
import { CuestionarioModel } from 'src/app/models/cuestionarios/cuestionario.model';
import { CuestionarioService } from 'src/app/services/cuestionarios/cuestionario.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { ManualCrearCuestionario } from '../../manuales/manual-crear-cuestionario/manual-crear-cuestionario.component';

@Component({
  selector: 'app-creacion-cuestionario',
  templateUrl: './creacion-cuestionario.component.html',
  styleUrls: ['./creacion-cuestionario.component.scss']
})
export class CreacionCuestionarioComponent implements OnInit {

  cuestionarioForm!: FormGroup;
  hasError: boolean = false;
  private unsubscribe: Subscription[] = [];
  usuario;


  constructor(
    private storageUser: LoginStorageUserService,
    private fb:FormBuilder,
    private cuestionarioService: CuestionarioService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private router: Router,
  ){

    this.usuario = this.storageUser.getUser();
    console.log(this.usuario);

    this.cuestionarioForm = this.fb.group({
      titulo: ['', Validators.required],
      destinatario: ['', Validators.required],
      codigo_centro: this.usuario?.cod_centro_estudios,
      preguntas: this.fb.array([]),
    }

  )}

  ngOnInit(): void {
  }

  /**
   * Devuelve las preguntas como un Array
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  preguntas() : FormArray {
    return this.cuestionarioForm.get("preguntas") as FormArray
  }


  /**
   * Genera un nuevo campo del formulario con tipo y pregunta vacíos para rellenarse
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  nuevaPregunta(): FormGroup {
    return this.fb.group({
      tipo: ['', Validators.required],
      pregunta: ['', Validators.required],
    });
  }


  /**
   * Añade una nueva pregunta al array de preguntas.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  addPregunta() {
    this.preguntas().push(this.nuevaPregunta());
  }


  /**
   * Elimina una pregunta en función de su identificador.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   * @param i determina el identificador de la pregunta por su posición
   */
  borrarPregunta(i:number) {
    this.preguntas().removeAt(i);
  }

  /**
   * Enviaría el cuestionario creado a la API.
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  onSubmit() {
    const cuestionarioModel= new CuestionarioModel();
    cuestionarioModel.setCuestionario(this.cuestionarioForm.value);
    const storageSub = this.cuestionarioService.add(cuestionarioModel)
    .pipe(first(),catchError((e) => {
      this.toastr.error('El cuestionario no ha podido guardarse', 'Error');
      return throwError(new Error(e));
    }))
    .subscribe((cuestionario: any) => {
      if (cuestionario) {
        var o: any = cuestionario;
        this.toastr.success("Formulario añadido con éxito", 'Añadido');
        this.router.navigate(['/cuestionarios/listar-cuestionarios']);
      } else {
        this.hasError = true;
      }
    })
    this.unsubscribe.push(storageSub);
  }


  /**
   * Despliega modal con ayuda para la creación de los cuestionarios
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  public abrirAyuda(): void {
    this.modal.open(ManualCrearCuestionario, { size: 'lg' });
  }

}
