import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { catchError, first, Observable, Subject, throwError } from 'rxjs';
import { CuestionarioModel } from 'src/app/models/cuestionarios/cuestionario.model';
import { CuestionarioService } from 'src/app/services/cuestionarios/cuestionario.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';

@Component({
  selector: 'app-listar-cuestionarios',
  templateUrl: './listar-cuestionarios.component.html',
  styleUrls: ['./listar-cuestionarios.component.scss']
})
export class ListarCuestionariosComponent implements OnDestroy, OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;
  usuario;
  cuestionarios!: Observable<Array<CuestionarioModel>>;
  cuestionariosArray: Array<CuestionarioModel> = [];

  constructor(
    private cuestionarioService: CuestionarioService,
    private router: Router,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private storageUser: LoginStorageUserService,
  ) {
    this.usuario = this.storageUser.getUser()
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
    this.listarCuestionarios();
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
   * Obtiene y lista en la tabla los cuestionarios asociados al código centro del usuario.
   * Establece el lenguaje castellano para la librería datatables
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  public listarCuestionarios() {
    this.cuestionarioService.getCuestionarios(this.usuario?.cod_centro_estudios).subscribe((response) => {
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
   * Redirige a la edición del cuestionario indicado por su id.
   * @param id del cuestionario
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  public editarCuestionario(id:number){
    this.router.navigate(['/cuestionarios/edicion-cuestionario/'+id]);
  }


  /**
   * Se elimina el cuestionario referenciado por su id.
   * Antes de hacerse el borrado se preguntará al usuario.
   * @param CuestionarioModel se envía como parámetro el modelo Cuestionario del que interesará conocer su id, destinatario y código centro.
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  public async eliminarCuestionario(id: number){
    let hacerlo = await this.dialogService.confirmacion(
      'Eliminar',
      `¿Está seguro de que desea eliminar el cuestionario?`
    );
    if (hacerlo) {
      this.cuestionarioService.eliminarCuestionario(id).subscribe({
      next: (res) => {
        this.toastr.success('Cuestionario Eliminado', 'Eliminado');
        this.listarCuestionarios();
      },
      error: e => {
        this.toastr.error('El cuestionario no ha podido eliminarse', 'Fallo');
      }
    })
    }else{
      this.toastr.info('El cuestionario está a salvo.', 'No eliminado');
    }
  }

  /**
   * Activación y desactivación de cuestionarios.
   * Sólo un cuestionario puede estar habilitado para empresa y sólo uno para alumno para cada centro.
   * Si el cuestionario está activado y se marca, este se desactivará
   * Si el cuestionario está desactivado y se marca, este se activará y hará que se desactive cualquier otro que ya
   * fuese activo para ese tipo de destinatario y con ese código centro.
   * @param CuestionarioModel se envía como parámetro el modelo Cuestionario del que interesará conocer su id, destinatario y código centro.
   * @author Pablo G. Galan <pablosiege@gmail.com@gmail.com>
   */
  public switchActivador(registro:CuestionarioModel){
    if (registro.activo){
      const storageSub = this.cuestionarioService.desactivarCuestionario(registro.id )
      .pipe(first(),catchError((e) => {
        this.toastr.error('Se ha producido un error', 'Error');
        return throwError(new Error(e));
      }))
      .subscribe((cuestionario: any) => {
        if (cuestionario) {
          var o: any = cuestionario;
          this.toastr.warning("Formulario desactivado", 'Desactivado');
          this.listarCuestionarios();
        } else {}
      });
    }
    else{
      const storageSub = this.cuestionarioService.activarCuestionario(registro.id, registro.destinatario, registro.codigo_centro )
      .pipe(first(),catchError((e) => {
        this.toastr.error('Se ha producido un error', 'Error');
        return throwError(new Error(e));
      }))
      .subscribe((cuestionario: any) => {
        if (cuestionario) {
          var o: any = cuestionario;
          this.toastr.success("Formulario activado", 'Activado');
         this.listarCuestionarios();
        } else {}
      });
    }
  }

}
