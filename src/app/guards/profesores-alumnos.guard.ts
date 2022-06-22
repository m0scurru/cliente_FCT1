import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { LoginStorageUserService } from '../services/login.storageUser.service';
@Injectable({
  providedIn: 'root'
})
export class ProfesoresAlumnosGuard implements CanActivate {
  constructor(
    private storage: LoginStorageUserService,
    private router: Router
  ) {}

  /**
   * Permite pasar al usuario si es profesor y tiene uno de los roles que se pasa como dato
   * Si no se pasa ningún rol, permite pasar a todos los profesores
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user: Usuario = this.storage.getUser()!;
    const roles: [number] | undefined = route.data['roles'];

    if (user.isAlumno()) {
      return true;
    }

    if (user.isProfesor()) {
      if (roles != undefined) {
        if (roles.length > 0) {
          for (let i = 0; i < roles.length; i++) {
            for (let j = 0; j < user.roles!.length; j++) {
              if (roles[i] === user.roles![j].id_rol) {
                return true;
              }
            }
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
    this.router.navigateByUrl('');
    return false;
  }
}
