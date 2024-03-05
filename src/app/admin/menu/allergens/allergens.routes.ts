import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./admin-allergens-home/admin-allergens-home.component`).then(m => m.AdminAllergensHomeComponent),
  }
];