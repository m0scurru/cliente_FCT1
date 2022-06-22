import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class LoginStorageUserService {
  private static readonly SESSION_STORAGE_USER_KEY: string = 'usuario';
  private static readonly SESSION_STORAGE_TOKEN_KEY: string = 'access_token';
  usuario?: Usuario;

  constructor() {}

  /***********************************************************************/
  //#region Gestión de usuario logueado

  /**
   * Establece un usuario como variable de sesión
   * @param user Objeto con los datos del usuario
   * @author Álvaro
   */
  public setUser(user: Usuario) {
    this.usuario = user;
    sessionStorage.setItem(
      LoginStorageUserService.SESSION_STORAGE_USER_KEY,
      JSON.stringify(this.usuario)
    );
  }

  /**
   * Obtiene un usuario de la sesión en forma de objeto
   * @returns Un objeto con el usuario en sesión
   * @author Álvaro
   */
  public getUser() {
    let user: string | any = sessionStorage.getItem(
      LoginStorageUserService.SESSION_STORAGE_USER_KEY
    );
    if (user) {
      this.usuario = Usuario.usuarioJSON(JSON.parse(user));
      return this.usuario;
    } else {
      return undefined;
    }
  }

  /**
   * Elimina al usuario de la sesión
   * @author Álvaro
   */
  public removeUser() {
    sessionStorage.removeItem(LoginStorageUserService.SESSION_STORAGE_USER_KEY);
  }

  /**
   * Comprueba si hay un usuario logueado
   *
   * @returns `boolean` true si hay usuario, false si no lo hay
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public isLogged() {
    return (
      this.getUser() != undefined && this.getTokenFromSession() != undefined
    );
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión del token

  /**
   * Establece en la sesión el token de acceso del usuario
   *
   * @param access_token `string` Token de acceso del usuario
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public setTokenSession(access_token: string) {
    sessionStorage.setItem(
      LoginStorageUserService.SESSION_STORAGE_TOKEN_KEY,
      access_token
    );
  }

  /**
   * Devuelve el token de acceso de la sesión
   *
   * @returns `string` Token de acceso del usuario
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public getTokenFromSession() {
    return sessionStorage.getItem(
      LoginStorageUserService.SESSION_STORAGE_TOKEN_KEY
    );
  }

  /**
   * Elimina el token de la sesión
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public removeToken() {
    sessionStorage.removeItem(
      LoginStorageUserService.SESSION_STORAGE_TOKEN_KEY
    );
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión de usuario y token combinados

  /**
   * Establece en la sesión tanto el usuario como el token
   *
   * @param user `Usuario` Objeto con los datos del usuario
   * @param access_token `string` Token de acceso del usuario
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public setUserWithToken(user: Usuario, access_token: string) {
    this.setUser(user);
    this.setTokenSession(access_token);
  }

  /**
   * Elimina de la sesión tanto el token como el usuario
   *
   * @author Dani J. Coello <daniel.jimenezcoello@gmail.com>
   */
  public removeUserAndToken() {
    this.removeUser();
    this.removeToken();
  }

  //#endregion
  /***********************************************************************/
}
