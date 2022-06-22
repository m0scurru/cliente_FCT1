import { Profesor } from './profesores/profesor';

export interface CentroEstudiosResponse {
  cod: string;
  cif: string;
  cod_centro_convenio: string;
  nombre: string;
  email: string;
  telefono: string;
  localidad: string;
  provincia: string;
  direccion: string;
  cp: string;
  director: Profesor;
}
