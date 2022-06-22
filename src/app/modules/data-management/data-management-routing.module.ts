import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsociarEmpAluComponent } from './asociar-emp-alu/asociar-emp-alu.component';
import { GestionEmpresasComponent } from './gestion-empresas/gestion-empresas.component';
import { CrudAnexosComponent } from './crud-anexos/crud-anexos.component';
import { RegistroEmpresaComponent } from './registro-empresa/registro-empresa.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { CrudProfesoresComponent } from './crud-profesores/crud-profesores.component';
import { GestionAlumnosComponent } from './gestion-alumnos/gestion-alumnos.component';
import { GestionGastosAlumnoComponent } from './gestion-gastos-alumno/gestion-gastos-alumno.component';
import { HistorialAnexosComponent } from './historial-anexos/historial-anexos.component';
import { AnexosAlumnosComponent } from './anexos-alumnos/anexos-alumnos.component';
import { ProgramaFormativoComponent } from './programa-formativo/programa-formativo.component';
//import { SectionEmpresaComponent } from './components/section-empresa/section-empresa.component';
import { GestionGastosProfesorComponent } from './gestion-gastos-profesor/gestion-gastos-profesor.component';
import { PerfilesGuard } from 'src/app/guards/perfiles.guard';
import { ProfesoresGuard } from 'src/app/guards/profesores.guard';
import { AlumnosGuard } from 'src/app/guards/alumnos.guard';
import { SeguimientoGuard } from 'src/app/guards/seguimiento.guard';
import { SeguimientoTutoresComponent } from './seguimiento-tutores/seguimiento-tutores.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import {ProfesoresAlumnosGuard} from 'src/app/guards/profesores-alumnos.guard';

const routes: Routes = [
  {
    path: 'asig-alum-empresa',
    component: AsociarEmpAluComponent,
    canActivate: [ProfesoresGuard],
    data: {
      roles: [3],
    },
  },
  {
    path: 'registro-empresa',
    component: RegistroEmpresaComponent,
    canActivate: [ProfesoresGuard],
  },
  {
    path: 'seguimiento',
    component: SeguimientoComponent,
    canActivate: [AlumnosGuard],
  },
  {
    path: 'seguimiento_tutores',
    component: SeguimientoTutoresComponent,
    canActivate: [SeguimientoGuard],
  },
  {
    path: 'gestion-empresas',
    component: GestionEmpresasComponent,
    canActivate: [ProfesoresGuard],
  },
  {
    path: 'gestion-alumnos',
    component: GestionAlumnosComponent,
    canActivate: [ProfesoresGuard],
    data: {
      roles: [1, 2, 3],
    },
  },
  {
    path: 'crud-anexos',
    component: CrudAnexosComponent,
    canActivate: [ProfesoresGuard],
  },
  {
    path: 'historial-anexos',
    component: HistorialAnexosComponent,
    canActivate: [ProfesoresGuard],
  },
  {
    path:'anexos-alumnos',
    component: AnexosAlumnosComponent,
    canActivate: [AlumnosGuard],
  },
  {
    path:'programa-formativo',
    component: ProgramaFormativoComponent,
    canActivate: [ProfesoresGuard],
  },
  {
    path: 'crud-profesores',
    component: CrudProfesoresComponent,
    canActivate: [ProfesoresGuard],
    data: {
      roles: [1, 2],
    },
  },
  {
    path:'notificaciones',
    component: NotificacionesComponent,
  },
  {
    path: 'gestion-gastos-alumno',
    component: GestionGastosAlumnoComponent,
    canActivate: [ProfesoresAlumnosGuard],
    data : {
      roles: [3]
    }
  },
  {
    path: 'gestion-gastos-profesor',
    component: GestionGastosProfesorComponent,
    canActivate: [ProfesoresGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagementRoutingModule {}
