import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./admin-settings-home/admin-settings-home.component`).then(m => m.AdminSettingsHomeComponent),
  },
  {
    path: `users`,
    loadChildren: () => import(`./users/users.routes`).then(m => m.routes)
  }
];