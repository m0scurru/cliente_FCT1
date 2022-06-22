import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginStorageUserService } from '../services/login.storageUser.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedGuard implements CanActivateChild {
  constructor(
    private storage: LoginStorageUserService,
    private router: Router
  ) {}

  /**
   * Permite pasar al usuario si está loggeado
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.storage.isLogged()) {
      return true;
    } else {
      this.router.navigateByUrl('');
      return false;
    }
  }
}
