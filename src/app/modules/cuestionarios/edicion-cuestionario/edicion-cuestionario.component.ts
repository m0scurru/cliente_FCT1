import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { catchError, first, Subscription, throwError } from 'rxjs';
import { CuestionarioModel } from 'src/app/models/cuestionarios/cuestionario.model';
import { PreguntaModel } from 'src/app/models/cuestionarios/pregunta.model';
import { CuestionarioService } from 'src/app/services/cuestionarios/cuestionario.service';
import { ManualCrearCuestionario } from '../../manuales/manual-crear-cuestionario/manual-crear-cuestionario.component';

@Component({
  selector: 'app-creacion-cuestionario',
  templateUrl: './edicion-cuestionario.component.html',
  styleUrls: ['./edicion-cuestionario.component.scss']
})
export class EdicionCuestionarioComponent implements OnInit {

  cuestionarioForm!: FormGroup;
  hasError: boolean = false;
  private unsubscribe: Subscription[] = [];
  cuestionario!: CuestionarioModel;
  cuestionarioID:any;


  constructor(
    private fb:FormBuilder,
    private cuestionarioService: CuestionarioService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
  ){
    this.cuestionarioID = this.route.snapshot.paramMap.get('id');
  }


  /**
   * Inicializa el cuestionario y carga las preguntas
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  ngOnInit(): void {
    this.cuestionarioForm = this.fb.group({
      id: 0,
      titulo: ['', Validators.required],
      destinatario: ['', Validators.required],
      preguntas: this.fb.array([]),
    });
    this.getCuestionario();
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
   * Carga un campo del formulario con tipo y pregunta vacíos para rellenarse
   * @author Pablo G. Galan <pablosiege@gmail.com>
   * @param tipo indica el tipo de pregunta
   * @param pregunta contiene la pregunta
   */
  nuevaPreguntaExistente(tipo:string, pregunta:string): FormGroup {
    return this.fb.group({
      tipo: [tipo, Validators.required],
      pregunta: [pregunta, Validators.required],
    });
  }


   /**
   * Añade al array de preguntas una nueva pregunta creada.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   * @param tipo indica el tipo de pregunta
   * @param pregunta contiene la pregunta
   */
  addPreguntaExistente(tipo:string, pregunta:string) {
    this.preguntas().push(this.nuevaPreguntaExistente(tipo,pregunta));
  }


  /**
   * Obtiene un cuestionario de la API por su id.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  getCuestionario() {
    this.cuestionarioService.getCuestionarioEdicion(this.cuestionarioID).subscribe((res) => {
      this.cuestionario = res;
      this.cuestionarioForm.patchValue(res);
      this.cuestionario.preguntas.forEach((element:PreguntaModel) => {
        this.addPreguntaExistente(element.tipo, element.pregunta);
      });
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
    const storageSub = this.cuestionarioService.update(cuestionarioModel)
    .pipe(first(),catchError((e) => {
      this.toastr.error('El cuestionario no ha podido editarse', 'Error');
      return throwError(new Error(e));
    }))
    .subscribe((cuestionario: any) => {
      if (cuestionario) {
        var o: any = cuestionario;
        this.toastr.success("Formulario editado con éxito", 'Añadido');
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
