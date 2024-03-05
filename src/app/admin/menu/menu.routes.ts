import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: `tags`,
    loadChildren: () => import(`./tags/tags.routes`).then(m => m.routes)
  },
  {
    path: ``,
    pathMatch: `full`,
    loadComponent: () => import(`./admin-menu-home/admin-menu-home.component`).then(m => m.AdminMenuHomeComponent),
  }
];