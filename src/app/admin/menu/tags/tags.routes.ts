import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./admin-menu-tags-home/admin-menu-tags-home.component`).then(m => m.AdminMenuTagsHomeComponent),
  }
];