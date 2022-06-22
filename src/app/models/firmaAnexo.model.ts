export class FirmaAnexoModel {
  codigo_anexo!: string;
  contenido!: string;

  setFirma(_firma: unknown) {
    const firma = _firma as FirmaAnexoModel;
    this.codigo_anexo = firma.codigo_anexo || '';
    this.contenido = firma.contenido || '';
  }
}
