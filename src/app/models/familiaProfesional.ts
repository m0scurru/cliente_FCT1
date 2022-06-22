import { FamiliaProfesionalResponse } from './familiaProfesionalResponse';

export class FamiliaProfesional {
  static familiaProfesionalJSON(obj: FamiliaProfesionalResponse) {
    return new FamiliaProfesional(obj['id'], obj['descripcion']);
  }

  constructor(public id: number, public descripcion: string) {}
}
