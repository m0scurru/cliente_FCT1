import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilesGuard } from 'src/app/guards/perfiles.guard';
import { ProfesoresGuard } from 'src/app/guards/profesores.guard';
import { CsvUploadComponent } from './csv-upload/csv-upload.component';

const routes: Routes = [
  {
    path: 'csv-upload',
    component: CsvUploadComponent,
    canActivate: [ProfesoresGuard],
    data: {
      roles: [1, 2],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataUploadRoutingModule {}
