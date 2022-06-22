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
  providedIn: 'root',
})
export class AlumnosGuard implements CanActivate {
  constructor(
    private storage: LoginStorageUserService,
    private router: Router
  ) {}

  /**
   * Permite pasar al usuario si es alumno
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

    if (user.isAlumno()) {
      return true;
    }
    this.router.navigateByUrl('');
    return false;
  }
}
