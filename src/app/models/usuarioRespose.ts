import { CentroEstudios } from "./centroEstudios";

export interface usuarioResponse {
  email: string;
  nombre: string;
  apellidos: string;
  dni: string;
  tipo: string;
  roles?: [];
  //DSB Cambio 10-03-2022: Añadido codigo de centro de estudios
  cod_centro?: string;
  cod_centro_estudios?: string;
  //DJC Cambio 28-05-2022: añadido objeto de centro de estudios
  centro?: CentroEstudios;
  cod_grupo?: string;
  curso_academico?: string;
}
