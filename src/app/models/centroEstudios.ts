import { CentroEstudiosResponse } from './centroEstudiosResponse';
import { Profesor } from './profesores/profesor';

export class CentroEstudios {
  static centroEstudiosJSON(obj: CentroEstudiosResponse) {
    return new CentroEstudios(
      obj['cod'],
      obj['cif'],
      obj['cod_centro_convenio'],
      obj['nombre'],
      obj['email'],
      obj['telefono'],
      obj['localidad'],
      obj['provincia'],
      obj['direccion'],
      obj['cp'],
      obj['director']
    );
  }

  constructor(
    public cod: string,
    public cif: string,
    public cod_centro_convenio: string,
    public nombre: string,
    public email: string,
    public telefono: string,
    public localidad: string,
    public provincia: string,
    public direccion: string,
    public cp: string,
    public director?: Profesor
  ) {}
}
