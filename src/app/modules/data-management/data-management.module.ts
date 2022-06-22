import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroEmpresaComponent } from './registro-empresa/registro-empresa.component';
import { AsociarEmpAluComponent } from './asociar-emp-alu/asociar-emp-alu.component';
import { FirmaDocComponent } from './firma-doc/firma-doc.component';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { ModalEditarComponent } from './seguimiento/modal-editar/modal-editar.component';
import { ModalAddComponent } from './seguimiento/modal-add/modal-add.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from  '@angular/cdk/drag-drop';
import { GestionEmpresasComponent } from './gestion-empresas/gestion-empresas.component';
import { ModalEmpresaComponent } from './modal-empresa/modal-empresa.component';
import { CrudAnexosComponent } from './crud-anexos/crud-anexos.component';
import { ModalFirmaComponent } from './modal-firma/modal-firma.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { CrudProfesoresComponent } from './crud-profesores/crud-profesores.component';
import { ModalProfesoresComponent } from './modal-profesores/modal-profesores.component';
import { GestionAlumnosComponent } from './gestion-alumnos/gestion-alumnos.component';
import { GestionGastosAlumnoComponent } from './gestion-gastos-alumno/gestion-gastos-alumno.component';
import { ModalAlumnoComponent } from './modal-alumno/modal-alumno.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalCambiotutorComponent } from './seguimiento/modal-cambiotutor/modal-cambiotutor.component';
import { HistorialAnexosComponent } from './historial-anexos/historial-anexos.component';
import { AnexosAlumnosComponent } from './anexos-alumnos/anexos-alumnos.component';
import { ModalTipoAnexoComponent } from './modal-tipo-anexo/modal-tipo-anexo.component';
import { ProgramaFormativoComponent } from './programa-formativo/programa-formativo.component';
import { ModalUploadAnexoComponent } from './modal-upload-anexo/modal-upload-anexo.component';
import { ModalSubirficheroComponent } from './seguimiento/modal-subirfichero/modal-subirfichero.component';
import { SeguimientoTutoresComponent } from './seguimiento-tutores/seguimiento-tutores.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { ModalConvenioComponent } from './modal-convenio/modal-convenio.component';
import { ModalGestionGastosAlumnoComponent } from './modal-gestion-gastos-alumno/modal-gestion-gastos-alumno.component';
import { ModalTicketDesplazamiento } from './modal-ticket-desplazamiento/modal-ticket-desplazamiento.component';
import { ModalTicketManutencion } from './modal-ticket-manutencion/modal-ticket-manutencion.component';
import { GestionGastosProfesorComponent } from './gestion-gastos-profesor/gestion-gastos-profesor.component';

@NgModule({
  declarations: [
    RegistroEmpresaComponent,
    AsociarEmpAluComponent,
    FirmaDocComponent,
    SeguimientoComponent,
    ModalEditarComponent,
    ModalAddComponent,
    GestionEmpresasComponent,
    ModalEmpresaComponent,
    CrudAnexosComponent,
    ModalFirmaComponent,
    CrudProfesoresComponent,
    ModalProfesoresComponent,
    ModalCambiotutorComponent,
    GestionAlumnosComponent,
    ModalAlumnoComponent,
    GestionGastosAlumnoComponent,
    ModalGestionGastosAlumnoComponent,
    ModalTicketDesplazamiento,
    ModalTicketManutencion,
    HistorialAnexosComponent,
    AnexosAlumnosComponent,
    ModalTipoAnexoComponent,
    ProgramaFormativoComponent,
    ModalUploadAnexoComponent,
    ModalSubirficheroComponent,
    SeguimientoTutoresComponent,
    NotificacionesComponent,
    ModalConvenioComponent,
    GestionGastosProfesorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataManagementRoutingModule,
    NgbModule,
    DragDropModule,
    SignaturePadModule,
    DataTablesModule
  ]
})
export class DataManagementModule { }
