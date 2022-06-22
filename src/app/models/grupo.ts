import { FamiliaProfesional } from './familiaProfesional';
import { grupoResponse } from './grupoResponse';

export class Grupo {
  static grupoJSON(obj: grupoResponse) {
    return new Grupo(
      obj['cod'],
      obj['nombre_ciclo'],
      obj['cod_nivel'],
      obj['familias']
    );
  }

  constructor(
    public cod: string,
    public nombre_ciclo: string,
    public cod_nivel?: string,
    public familias?: FamiliaProfesional[]
  ) {}
}
