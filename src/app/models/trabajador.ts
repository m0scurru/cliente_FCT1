import { TrabajadorResponse } from './trabajadorResponse';

export class Trabajador {
  static trabajadorJSON(obj: TrabajadorResponse) {
    return new Trabajador(
      obj['dni'],
      obj['email'],
      obj['nombre'],
      obj['apellidos'],
      obj['id_empresa']
    );
  }

  constructor(
    public dni: string,
    public email: string,
    public nombre: string,
    public apellidos: string,
    public id_empresa: string
  ) {}
}
