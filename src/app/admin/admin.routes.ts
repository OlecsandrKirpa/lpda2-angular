import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./dashboard/admin-dashboard.component`).then(m => m.AdminDashboardComponent),
  },
];
