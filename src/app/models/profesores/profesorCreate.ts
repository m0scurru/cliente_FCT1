import { profesorCreateResponse } from './profesorCreateResponse';

export class ProfesorCreate {
  static userJSON(obj: profesorCreateResponse) {
    return new ProfesorCreate(
      obj['dni'],
      obj['email'],
      obj['nombre'],
      obj['apellidos'],
      obj['password1'],
      obj['password2'],
      obj['roles'],
      obj['personaAux']
    );
  }

  constructor(
    public dni: string,
    public email: string,
    public nombre: string,
    public apellidos: string,
    public password1: string,
    public password2: string,
    public roles?: number[],
    public personaAux?: string
  ) {}
}
