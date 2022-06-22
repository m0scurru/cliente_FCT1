import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { CuestionarioRespondidoService } from 'src/app/services/cuestionarios/cuestionarioRespondido.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})

/**
 * GuardService destinado a validar que el usuario sea de tipo alumno o tutor empresa.
 * @author Pablo G. Galan <pablosiege@gmail.com>
 */
export class UsuarioCuestionariosGuardService implements CanActivate {

  usuario;

  constructor(
    private storageUser: LoginStorageUserService,
    private cuestionarioRespondido: CuestionarioRespondidoService,
    private toastr: ToastrService,
  ) {
    this.usuario = this.storageUser.getUser();
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    let respondido = await this.getData();

    if (this.usuario!.isAlumno() || this.usuario!.isTutorEmpresa()) {
      if(respondido){
        this.toastr.info('No hay cuestionarios pendientes de contestar', '¡Atención!');
        return false;
      }return true;
    }
    return false;
  }

  /**
   * Verifica si el cuestionario ha sido respondido por el usuario.
   * @return true si el cuestionario ya ha sido contestado
   * @author Pablo G. Galan <pablosiege@gmail.com>
   */
  async getData() {
    let data = await this.cuestionarioRespondido.getDataSynchronous(this.usuario?.dni, this.usuario?.tipo)
    if(data.length>0){
      return true;
    } return false;
 }

}
