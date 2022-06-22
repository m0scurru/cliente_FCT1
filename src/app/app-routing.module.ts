import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from './guards/logged.guard';
import { LoginStorageUserService } from './services/login.storageUser.service';

const storage = new LoginStorageUserService();
const routes: Routes = [
  {
    path: 'data-upload',
    loadChildren: () =>
      import('./modules/data-upload/data-upload.module').then(
        (m) => m.DataUploadModule
      ),
    canActivateChild: [LoggedGuard],
  },
  {
    path: '',
    loadChildren: () =>
      storage.isLogged()
        ? import('./core/core.module').then((m) => m.CoreModule)
        : import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'data-management',
    loadChildren: () =>
      import('./modules/data-management/data-management.module').then(
        (m) => m.DataManagementModule
      ),
    canActivateChild: [LoggedGuard],
  },
  {
    path:'cuestionarios',
    loadChildren:() =>
      import('./modules/cuestionarios/cuestionarios.module').then(
        (m) => m.CuestionariosModule
      ),
    canActivateChild: [LoggedGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
