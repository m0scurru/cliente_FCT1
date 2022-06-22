import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CsvUploadComponent } from './csv-upload/csv-upload.component';
import { DataUploadRoutingModule } from './data-upload-routing.module';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    CsvUploadComponent,
    ModalInfoComponent
  ],
  imports: [
    SharedModule,
    NgxDropzoneModule,
    DataUploadRoutingModule,
    NgbModule
    // ModalInfoModule
  ]
})
export class DataUploadModule { }
