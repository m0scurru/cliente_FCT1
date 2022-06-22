import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';


@Injectable({
  providedIn: 'root'
})

/**
 * GuardService destinado a validar que el usuario sea de tipo Jefatura.
 * @author Pablo G. Galan <pablosiege@gmail.com>
 */
export class JefaturaCuestionariosGuardService implements CanActivate {

  usuario;

  constructor(
    private storageUser: LoginStorageUserService,
  ) {
    this.usuario = this.storageUser.getUser();
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.usuario!.isJefatura()) {
      return true;
    }
    return false;
  }
}
