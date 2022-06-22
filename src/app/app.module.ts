import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ManualCrudAnexosComponent } from './modules/manuales/manual-crud-anexos/manual-crud-anexos.component';
import { ManualCrudProfesoresComponent } from './modules/manuales/manual-crud-profesores/manual-crud-profesores.component';
import { ManualGestionEmpresasComponent } from './modules/manuales/manual-gestion-empresas/manual-gestion-empresas.component';
import { ManualAnexo3Component } from './modules/manuales/manual-anexo3/manual-anexo3.component';
import { ManualAsigAlumComponent } from './modules/manuales/manual-asig-alum/manual-asig-alum.component';
import { ManualGestionAlumnosComponent } from './modules/manuales/manual-gestion-alumnos/manual-gestion-alumnos.component';
import { ManualGestionGastosProfesorComponent } from './modules/manuales/manual-gestion-gastos-profesor/manual-gestion-gastos-profesor.component';
import { ManualGestionGastosAlumnoComponent } from './modules/manuales/manual-gestion-gastos-alumno/manual-gestion-gastos-alumno.component';
import { ManualRegistroEmpresasComponent } from './modules/manuales/manual-registro-empresas/manual-registro-empresas.component';
import { ManualCrudAnexosAlumnosComponent } from './modules/manuales/manual-crud-anexos-alumnos/manual-crud-anexos-alumnos.component';
import { ManualAnexo2y4Component } from './modules/manuales/manual-anexo2y4/manual-anexo2y4.component';

// import { ModalInfoComponent } from './src/app/modules/data-upload/modal-info/modal-info.component';
// import { NgxDropzoneModule } from 'ngx-dropzone';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ManualCrudAnexosComponent,
    ManualCrudProfesoresComponent,
    ManualGestionEmpresasComponent,
    ManualAnexo3Component,
    ManualAsigAlumComponent,
    ManualGestionAlumnosComponent,
    ManualGestionGastosProfesorComponent,
    ManualGestionGastosAlumnoComponent,
    ManualRegistroEmpresasComponent,
    ManualCrudAnexosAlumnosComponent,
    ManualAnexo2y4Component,
    // ModalInfoComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    DragDropModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [NgbModule, MatDialogModule],

  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
