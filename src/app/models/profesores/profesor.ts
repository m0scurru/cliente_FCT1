import { profesorResponse } from './profesorResponse';

export class Profesor {
  static anexoJSON(obj: profesorResponse) {
    return new Profesor(
      obj['dni'],
      obj['email'],
      obj['nombre'],
      obj['apellidos'],
      obj['centro_estudios'],
      obj['roles']
    );
  }

  constructor(
    public dni: string,
    public email: string,
    public nombre: string,
    public apellidos: string,
    public centro_estudios?: string,
    public roles?: number[]
  ) {}
}
