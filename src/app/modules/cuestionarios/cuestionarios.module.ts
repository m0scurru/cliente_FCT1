import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestarCuestionarioComponent } from './contestar-cuestionario/contestar-cuestionario.component';
import { CreacionCuestionarioComponent } from './creacion-cuestionario/creacion-cuestionario.component';
import { ListarCuestionariosComponent } from './listar-cuestionarios/listar-cuestionarios.component';
import { ListarRespuestasComponent } from './listar-respuestas/listar-respuestas.component';
import { EdicionCuestionarioComponent } from './edicion-cuestionario/edicion-cuestionario.component';
import { CuestionariosRoutingModule } from './cuestionarios-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ListarCuestionariosTutorEmpresaComponent } from './listar-cuestionarios-tutor-empresa/listar-cuestionarios-tutor-empresa.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    ContestarCuestionarioComponent,
    CreacionCuestionarioComponent,
    ListarCuestionariosComponent,
    ListarRespuestasComponent,
    EdicionCuestionarioComponent,
    ListarCuestionariosTutorEmpresaComponent,
  ],
  imports: [
    CommonModule,
    CuestionariosRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbModule,
    NgxChartsModule,
  ]
})
export class CuestionariosModule { }
