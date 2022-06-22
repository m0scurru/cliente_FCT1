import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, first, Observable, Subscription, throwError } from 'rxjs';
import { CuestionarioModel } from 'src/app/models/cuestionarios/cuestionario.model';
import { PreguntaModel } from 'src/app/models/cuestionarios/pregunta.model';
import { RespuestaCuestionarioModel } from 'src/app/models/cuestionarios/respuesta-cuestionario.model';
import { CuestionarioService } from 'src/app/services/cuestionarios/cuestionario.service';
import { CuestionarioRespondidoService } from 'src/app/services/cuestionarios/cuestionarioRespondido.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { CuestionarioTutorEmpresaModel } from 'src/app/models/cuestionarios/cuestionarios-tutor-empresa.model';


@Component({
  selector: 'app-contestar-cuestionario',
  templateUrl: './contestar-cuestionario.component.html',
  styleUrls: ['./contestar-cuestionario.component.scss'],
})
export class ContestarCuestionarioComponent implements OnInit {

  respuestasForm!: FormGroup;
  hasError: boolean = false;
  private unsubscribe: Subscription[] = [];
  cuestionario!: CuestionarioModel;
  usuarioCuestionario!: string|null;
  usuario;
  alumnoTutorEmpresa!: CuestionarioTutorEmpresaModel;

  constructor(
    private fb:FormBuilder,
    private toastr: ToastrService,
    private cuestionarioService: CuestionarioService,
    private cuestionarioRespondidoService: CuestionarioRespondidoService,
    private route: ActivatedRoute,
    private router: Router,
    private storageUser: LoginStorageUserService,

  ) {
    this.usuario = storageUser.getUser();
    console.log(this.usuario);
  }

  /**
   *  Se obtiene e inicializa el cuestionario en función del destinatario
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  ngOnInit(): void {
    this.route.queryParamMap
    .subscribe((params) => {
      this.usuarioCuestionario = this.route.snapshot.paramMap.get('tipo');
      if (this.usuarioCuestionario=='alumno'){
        this.respuestasForm = this.fb.group({
          titulo: '',
          destinatario: '',
          codigo_centro: this.usuario?.cod_centro,
          id_usuario: this.usuario?.dni,
          ciclo: this.usuario?.cod_grupo,
          curso_academico: this.usuario?.curso_academico,
          respuestas: this.fb.array([]),
        });
        this.getCuestionario(this.usuario?.cod_centro);
      }else{
        this.respuestasForm = this.fb.group({
          titulo: '',
          destinatario: '',
          codigo_centro: params.get('cod_centro'),
          id_usuario: params.get('dni_alumno'),
          ciclo: params.get('cod_grupo'),
          curso_academico: params.get('curso_academico'),
          respuestas: this.fb.array([]),
          dni_tutor_empresa: this.usuario?.dni,
        });
        this.getCuestionarioFCT(params.get('cod_centro'));
      }
      });
  }

  /**
   * Obtiene todas las respuestas como un array
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  respuestas() : FormArray {
    return this.respuestasForm.get("respuestas") as FormArray
  }


  /**
   * Genera un item del cuestionario con su tipo, pregunta y su respuesta vacía.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   * @param tipo indica el tipo
   * @param pregunta indica la pregunta
   */
  nuevaRespuesta(tipo:string, pregunta:string): FormGroup {
    return this.fb.group({
      tipo: tipo,
      pregunta: pregunta,
      respuesta: ['', Validators.required],
    });
  }


  /**
   *  Devuelve la respuesta en la posición indicada
   * @author Pablo G. Galan <pablosiege@gmail.com>
   * @param i determina la posición
   */
  getPregunta(i:number){
    let respuestas= this.respuestas();
    return respuestas.at(i);
  }


  /**
   *  Genera un campo respuesta en función del tipo asociado a una pregunta.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   * @param tipo tipo rango o texto
   * @param pregunta será asociada con la respuesta recogida.
   */
  addRespuesta(tipo:string, pregunta:string) {
    this.respuestas().push(this.nuevaRespuesta(tipo,pregunta));
  }


  /**
   *  Se obtiene cuestionario en función del código centro y del destinatario en caso de haber alguno activo.
   *  Se genera un campo respuesta por cada pregunta en función de su tipo.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   * @param cod_centro indica el código del centro al que pertenece el alumno, o cuyo alumno tiene asociado el tutor de empresa
   */
  getCuestionario(cod_centro_estudios:string|undefined|null) {
  this.cuestionarioService.getCuestionario(this.usuarioCuestionario, cod_centro_estudios).subscribe((res) => {
    this.cuestionario = res;
    if(!this.cuestionario.activo){
      this.toastr.warning('Aún no se ha activado el cuestionario', 'Warning');
      if (this.usuarioCuestionario=='empresa'){
        this.router.navigate(['cuestionarios/listar-cuestionarios-tutor-empresa']);
      }else{
        this.router.navigate(['/']);
      }
    }
    this.respuestasForm.patchValue(res);
    this.cuestionario.preguntas.forEach((element:PreguntaModel) => {
      this.addRespuesta(element.tipo, element.pregunta);
    });
  },
  error => {
    this.toastr.warning('Aún no se ha activado el cuestionario', 'Warning');
      if (this.usuarioCuestionario=='empresa'){
        this.router.navigate(['cuestionarios/listar-cuestionarios-tutor-empresa']);
      }else{
        this.router.navigate(['/']);
      }
  },
  () => {});
  }


  /**
   *  Se obtiene cuestionario en función del código centro y del destinatario en caso de haber alguno activo.
   *  Se genera un campo respuesta por cada pregunta en función de su tipo.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   * @param cod_centro indica el código del centro al que pertenece el alumno, o cuyo alumno tiene asociado el tutor de empresa
   */
  getCuestionarioFCT(cod_centro_estudios:string|undefined|null) {
  this.cuestionarioService.getCuestionarioFCT(this.usuarioCuestionario, cod_centro_estudios).subscribe((res) => {
    this.cuestionario = res;
    if(!this.cuestionario.activo){
      this.toastr.warning('Aún no se ha activado el cuestionario', 'Warning');
      if (this.usuarioCuestionario=='empresa'){
        this.router.navigate(['cuestionarios/listar-cuestionarios-tutor-empresa']);
      }else{
        this.router.navigate(['/']);
      }
    }
    this.respuestasForm.patchValue(res);
    this.cuestionario.preguntas.forEach((element:PreguntaModel) => {
      this.addRespuesta(element.tipo, element.pregunta);
    });
  },
  error => {
    this.toastr.warning('Aún no se ha activado el cuestionario', 'Warning');
      if (this.usuarioCuestionario=='empresa'){
        this.router.navigate(['cuestionarios/listar-cuestionarios-tutor-empresa']);
      }else{
        this.router.navigate(['/']);
      }
  },
  () => {});
  }


  /**
   *  Envía el cuestionario a la API para ser guardado.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  onSubmit() {
    const respuestaCuestionarioModel= new RespuestaCuestionarioModel();
    respuestaCuestionarioModel.setCuestionario(this.respuestasForm.value);

    const storageSub = this.cuestionarioRespondidoService.add(respuestaCuestionarioModel, this.usuario?.tipo)
    .pipe(first(),catchError((e) => {
      this.toastr.error('El cuestionario no ha podido guardarse', 'Error');
      return throwError(new Error(e));
    }))
    .subscribe((cuestionario: any) => {
      if (cuestionario) {
        var o: any = cuestionario;
        this.toastr.success("Formulario añadido con éxito", 'Añadido');
        if (this.usuarioCuestionario=='empresa'){
          this.router.navigate(['cuestionarios/listar-cuestionarios-tutor-empresa']);
        }else{
          this.router.navigate(['/']);
        }
      } else {
        this.hasError = true;
      }
    })
    this.unsubscribe.push(storageSub);
  }

}

