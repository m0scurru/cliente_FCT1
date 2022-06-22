import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SignaturePad } from 'angular2-signaturepad';
import { ToastrService } from 'ngx-toastr';
import { Subscription, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { FirmaAnexoModel } from 'src/app/models/firmaAnexo.model';
import { FirmaService } from 'src/app/services/firma-anexo.service';

@Component({
  selector: 'app-modal-firma',
  templateUrl: './modal-firma.component.html',
  styleUrls: ['./modal-firma.component.scss'],
})
export class ModalFirmaComponent implements OnInit {
  /***********************************************************************/
  //#region Inicialización de variables

  signatureImg!: string;
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;
  @Input() codigo_anexo: any;


  signaturePadOptions: Object = {
    minWidth: 2,
    canvasWidth: 450,
    canvasHeight: 300,
  };

  private unsubscribe: Subscription[] = [];

  constructor(
    private modalActive: NgbActiveModal,
    private firmaService: FirmaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 2);
    this.signaturePad.clear();
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Gestión del dibujo en el signature-pad

  drawComplete() {
    // console.log(this.signaturePad.toDataURL());
  }

  drawStart() {
  }

  /**
   * Borra lo dibujado en el signature-pad
   * @author Pablo
   */
  clearSignature() {
    this.signaturePad.clear();
  }

  /**
   * Guarda lo dibujado en el signature-pad y lo envía al servidor en base64
   * @author Pablo
   */
  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    const firma = new FirmaAnexoModel();

    firma.codigo_anexo = this.codigo_anexo;
    firma.contenido = this.signatureImg;

    const storageSub = this.firmaService
      .add(firma)
      .pipe(
        first(),
        catchError((e) => {
          this.toastr.error('El anexo no ha podido ser firmado', 'Fallo');
          return throwError(new Error(e));
        })
      )
      .subscribe((storage: FirmaAnexoModel) => {
        if (storage) {
          var o: any = storage;
          this.toastr.success('Firma añadida', 'Añadida');
          let mensaje: String = o.mensaje
            .replaceAll('\\r', '\r')
            .replaceAll('\\n', '\n');
          this.closeModal();
        } else {
          // TODO: error
        }
      });
    this.unsubscribe.push(storageSub);
  }

  //#endregion
  /***********************************************************************/

  /***********************************************************************/
  //#region Funciones auxiliares y otros

  /**
   * Cierra el modal de firma de anexos
   * @author Pablo
   */
  closeModal() {
    this.modalActive.close();
  }

  //#endregion
  /***********************************************************************/
}
