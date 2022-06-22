import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { LoginStorageUserService } from '../services/login.storageUser.service';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoGuard implements CanActivate {

  constructor(
    private storage: LoginStorageUserService,
    private router: Router
  ) { }

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

    if (user.isProfesor()) {
      for (let j = 0; j < user.roles!.length; j++) {
        if (user.roles![j].id_rol === 3) {
          return true;
        }
      }
    }

    if (user.isTrabajador()) {
      for (let j = 0; j < user.roles!.length; j++) {
        console.log(user.roles);
        if (user.roles![j].id_rol === 2 || user.roles![j].id_rol === 3) {
          return true;
        }
      }
    }
    this.router.navigateByUrl('');
    return false;
  }

}
