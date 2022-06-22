export interface profesorCreateResponse {
  dni: string;
  email: string;
  nombre: string;
  apellidos: string;
  password1: string;
  password2: string;
  roles?: number[];
  personaAux?: string;
}
