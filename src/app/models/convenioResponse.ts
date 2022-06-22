import { CentroEstudios } from "./centroEstudios";
import { Empresa } from "./empresa";

export interface ConvenioResponse {
  cod_convenio: string;
  cod_centro: string;
  id_empresa: number;
  fecha_ini: Date;
  fecha_fin: Date;
  ruta_anexo: string;
  centro: CentroEstudios;
  empresa: Empresa;
}
