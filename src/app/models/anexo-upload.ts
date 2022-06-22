import { anexoUploadResponse } from './anexoUploadResponse';

export class AnexoUpload {
  static anexoJSON(obj: anexoUploadResponse) {
    return new AnexoUpload(
      obj['file'],
      obj['tipoAnexo'],
      obj['nombreArchivo'],
      obj['dni'],
    )
  }

  constructor(
    public file: any,
    public tipoAnexo: string,
    public nombreArchivo:string,
    public dni: string,

  )
  {}
}
