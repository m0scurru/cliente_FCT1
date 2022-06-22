import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CuestionarioRespondidoModel } from 'src/app/models/cuestionarios/cuestionarioRespondido.model';
import { CuestionariosRespondidosMediasModel } from 'src/app/models/cuestionarios/cuestionariosRespondidosMedias.model';
import { CursoAcademicoModel } from 'src/app/models/cuestionarios/cursoAcademico.model';
import { CuestionarioService } from 'src/app/services/cuestionarios/cuestionario.service';
import { CuestionarioRespondidoService } from 'src/app/services/cuestionarios/cuestionarioRespondido.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';

@Component({
  selector: 'app-listar-respuestas',
  templateUrl: './listar-respuestas.component.html',
  styleUrls: ['./listar-respuestas.component.scss']
})
export class ListarRespuestasComponent implements OnInit {

  filtrosGraficasForm!: FormGroup;
  mediaCuestionarios:Array<CuestionariosRespondidosMediasModel>=[];
  usuario;
  cursoAcademicoSeleccionado!: string;
  destinatarioSeleccionado: string = "alumno";
  cursosAcademicos:Array<CursoAcademicoModel>=[];
  cuestionarios!: Array<CuestionarioRespondidoModel>;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();

  constructor(
    private cuestionarioRespondidoService: CuestionarioRespondidoService,
    private storageUser: LoginStorageUserService,
    private fb:FormBuilder,
    private cuestionarioService: CuestionarioService,
  ){
    this.usuario = this.storageUser.getUser()
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.cuestionarios);
  }

  /**
   * Elimina las opciones predefeinidas de lenguaje de la librería datatables.
   * Inicializa el formulario que filtra los resultados a mostrar por curso académico y destinatario.
   * Llama a la función obtener cursosAcadémicos que inicializa los gráficos y tablas para el año más cercano al actual si este no existiese.
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  ngOnInit(): void {

    delete this.dtOptions['language'];

    this.filtrosGraficasForm = this.fb.group({
      curso_academico: [""],
      destinatario: [""],
    });
    this.obtenerCursosAcademicos();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  /**
   * Recarga la tabla eliminando la instancia de la DataTable
   * @author David Sánchez Barragán
   */
  rerender(): void {
    this.dtElement!.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.cuestionarios);
    });
  }

  /**
   * Se inicializa el Formulario para filtrar por curso académico o destinatario con valores preestablecidos.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  public inicializarForm(){
    this.filtrosGraficasForm = this.fb.group({
      curso_academico: [
        this.cursoAcademicoSeleccionado
      ],
      destinatario: [
        this.destinatarioSeleccionado
      ],})
  }

  /**
   * Se cambian los resultados mostrados en gráfica y tabla al cambiar el curso académico del formulario.
   * @param event evento change del curso académico
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  public changeCursoAcademico(event:any){
    this.cursoAcademicoSeleccionado=event.target.value;
    this.obtenerDatosGraficos();
    this.listarCuestionariosRespondidos();
  }

  /**
   * Se cambian los resultados mostrados en gráfica y tabla al cambiar el destinatario del formulario.
   * @param event evento change del curso académico
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  public changeDestinatario(event:any){
    this.destinatarioSeleccionado=event.target.value;
    this.obtenerDatosGraficos();
    this.listarCuestionariosRespondidos();
  }

  /**
   * Se obtienen los cursos académicos y se establece por defecto el más reciente.
   * Se inicializan formulario, gráficas y tabla.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  public obtenerCursosAcademicos() {
    this.cuestionarioRespondidoService.obtenerCursoAcademico().subscribe((response) => {
      this.cursosAcademicos = response;
      if(this.cursosAcademicos.length>0){
        this.cursoAcademicoSeleccionado=this.cursosAcademicos[0].curso_academico;
      }
      this.inicializarForm();
      this.obtenerDatosGraficos();
      this.listarCuestionariosRespondidos();
    });
  }

  /**
   * Se obtienen las medias de las respuestas de tipo rango almacenadas en los cuestionarios seleccionados.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  public obtenerDatosGraficos() {
    if(this.usuario?.isJefatura()){
      this.cuestionarioRespondidoService.obtenerMediasCuestionariosRespondidos(this.cursoAcademicoSeleccionado , this.destinatarioSeleccionado, this.usuario?.cod_centro_estudios, "jefatura").subscribe((response) => {
        this.mediaCuestionarios = response;
      });
    }else{
      this.cuestionarioRespondidoService.obtenerMediasCuestionariosRespondidos(this.cursoAcademicoSeleccionado , this.destinatarioSeleccionado, this.usuario?.cod_centro_estudios, "tutor").subscribe((response) => {
        this.mediaCuestionarios = response;
      });
    }

  }

  /**
   * Se obtienen los cuestionarios respondidos y se muestran en la tabla con los datos de los usuarios que hayan sido filtrados.
   * Se establece el lenguaje a castellano para la librería datatables.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  public listarCuestionariosRespondidos() {
    console.log(this.usuario?.isJefatura())
    if (this.usuario?.isJefatura()){
      this.cuestionarioRespondidoService.obtenerCuestionariosRespondidos(this.cursoAcademicoSeleccionado , this.destinatarioSeleccionado, this.usuario?.cod_centro_estudios, "jefatura" ).subscribe((response) => {
        this.cuestionarios = response;
        this.rerender();
        this.dtTrigger.next(this.cuestionarios);
        $.fn.dataTable.ext.errMode = 'throw';
      });
      $.extend(true, $.fn.dataTable.defaults, {
        "language": { "url": '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' }
      })
    }else{
      this.cuestionarioRespondidoService.obtenerCuestionariosRespondidos(this.cursoAcademicoSeleccionado , this.destinatarioSeleccionado, this.usuario?.cod_centro_estudios, "tutor" ).subscribe((response) => {
        this.cuestionarios = response;
        this.rerender();
        this.dtTrigger.next(this.cuestionarios);
        $.fn.dataTable.ext.errMode = 'throw';
      });
      $.extend(true, $.fn.dataTable.defaults, {
        "language": { "url": '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' }
      })
    }

  }

  /**
   * Descarga como pdf el cuestionario especificado.
   * @param id del cuestionario.
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  public descargarCuestionarioRespondido(id:number) {

    if (this.usuario?.isJefatura()){
      this.cuestionarioService.descargarCuestionario(id, "jefatura").subscribe((blob: any) => {
        const a = document.createElement('a')
          const objectUrl = URL.createObjectURL(blob)
          a.href = objectUrl
          a.download = id+'_cuestionario.pdf';
          a.click();
          URL.revokeObjectURL(objectUrl);
      }), (error: any) => console.log('Error downloading the file');
    }else{
      this.cuestionarioService.descargarCuestionario(id, "tutor").subscribe((blob: any) => {
        const a = document.createElement('a')
          const objectUrl = URL.createObjectURL(blob)
          a.href = objectUrl
          a.download = id+'_cuestionario.pdf';
          a.click();
          URL.revokeObjectURL(objectUrl);
      }), (error: any) => console.log('Error downloading the file');
    }

  }




}
