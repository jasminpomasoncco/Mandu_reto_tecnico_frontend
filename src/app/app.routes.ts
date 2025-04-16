import { Routes } from '@angular/router';
import { DivisionsTableComponent } from './divisions-table/divisions-table.component';

export const routes: Routes = [
  {
    path: '',
    component: DivisionsTableComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
