import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { CuestionarioModel } from 'src/app/models/cuestionarios/cuestionario.model';
import { CuestionarioTutorEmpresaModel } from 'src/app/models/cuestionarios/cuestionarios-tutor-empresa.model';
import { CuestionarioService } from 'src/app/services/cuestionarios/cuestionario.service';
import { TutorEmpresaService } from 'src/app/services/cuestionarios/tutor-empresa.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';

@Component({
  selector: 'app-listar-cuestionarios-tutor-empresa',
  templateUrl: './listar-cuestionarios-tutor-empresa.component.html',
  styleUrls: ['./listar-cuestionarios-tutor-empresa.component.scss']
})
export class ListarCuestionariosTutorEmpresaComponent implements OnDestroy, OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;
  usuario;
  cuestionarios!: Observable<Array<CuestionarioTutorEmpresaModel>>;
  cuestionariosArray: Array<CuestionarioTutorEmpresaModel> = [];

  constructor(
    private tutorEmpresaServiceService: TutorEmpresaService,
    private router: Router,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private storageUser: LoginStorageUserService,
  ){
    this.usuario = this.storageUser.getUser();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.cuestionariosArray);
  }


  /**
   * Elimina las opciones predefeinidas de lenguaje de la librería datatables.
   * Hace una llamada a listarCuestionarios listarCuestionarios.
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  ngOnInit(): void {
    delete this.dtOptions['language'];
    this.listarCuestionariosTutorEmpresa();
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
      this.dtTrigger.next(this.cuestionariosArray);
    });
  }


  /**
   * Obtiene de la API y lista los cuestionarios asociados a un tutor empresa, uno o varios, según los alumnos asignados.
   * Establece el lenguaje castellano para la librería datatables
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  public listarCuestionariosTutorEmpresa() {
    this.tutorEmpresaServiceService.getCuestionarios(this.usuario?.dni).subscribe((response) => {
      this.cuestionariosArray = response;
      response = (this.cuestionariosArray as any).data;
      this.rerender();
      this.dtTrigger.next(this.cuestionariosArray);
      $.fn.dataTable.ext.errMode = 'throw';
    });
    $.extend(true, $.fn.dataTable.defaults, {
      "language": { "url": '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' }
    })
  }


  /**
   * Se redirecciona a contestar cuestionario del alumno seleccionado
   * @param CuestionarioTutorEmpresaModel se envía como parámetro el modelo del que se obtienen los datos para la redirección.
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  public contestarCuestionarioAlumno(registro:CuestionarioTutorEmpresaModel){
    this.router.navigate(['/cuestionarios/contestar-cuestionario/empresa'], { queryParams: { dni_alumno: registro.dni_alumno, curso_academico:registro.curso_academico, cod_grupo:registro.cod_grupo, cod_centro: registro.cod_centro} });
  }


}
