import { FamiliaProfesional } from './familiaProfesional';

export interface grupoResponse {
  cod: string;
  nombre_ciclo: string;
  cod_nivel?: string;
  familias?: FamiliaProfesional[];
}
