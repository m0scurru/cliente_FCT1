import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContestarCuestionarioComponent } from './contestar-cuestionario/contestar-cuestionario.component';
import { CreacionCuestionarioComponent } from './creacion-cuestionario/creacion-cuestionario.component';
import { EdicionCuestionarioComponent } from './edicion-cuestionario/edicion-cuestionario.component';
import { ListarCuestionariosComponent } from './listar-cuestionarios/listar-cuestionarios.component';
import { ListarRespuestasComponent } from './listar-respuestas/listar-respuestas.component';
import { UsuarioCuestionariosGuardService } from './services/usuario.service';
import { JefaturaCuestionariosGuardService } from './services/jefatura.service';
import { ListarCuestionariosTutorEmpresaComponent } from './listar-cuestionarios-tutor-empresa/listar-cuestionarios-tutor-empresa.component';
import { TutorCuestionariosGuardService } from './services/tutor.service';



const routes: Routes = [
  {
    path:'contestar-cuestionario/:tipo',
    canActivate: [UsuarioCuestionariosGuardService],
    component: ContestarCuestionarioComponent
  },
  {
    path:'listar-cuestionarios-tutor-empresa',
    // canActivate: [UsuarioCuestionariosGuardService],
    component: ListarCuestionariosTutorEmpresaComponent
  },
  {
    path:'creacion-cuestionario',
    canActivate: [JefaturaCuestionariosGuardService],
    component: CreacionCuestionarioComponent
  },
  {
    path:'edicion-cuestionario/:id',
    canActivate: [JefaturaCuestionariosGuardService],
    component: EdicionCuestionarioComponent
  },
  {
    path:'listar-cuestionarios',
    canActivate: [JefaturaCuestionariosGuardService],
    component: ListarCuestionariosComponent
  },
  {
    path:'listar-respuestas',
    canActivate: [JefaturaCuestionariosGuardService],
    component: ListarRespuestasComponent
  },
  {
    path:'listar-respuestas-tutor',
    canActivate: [TutorCuestionariosGuardService],
    component: ListarRespuestasComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuestionariosRoutingModule { }
