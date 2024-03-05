import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./admin-ingredients-home/admin-ingredients-home.component`).then(m => m.AdminIngredientsHomeComponent),
  }
];