import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./dashboard/admin-dashboard.component`).then(m => m.AdminDashboardComponent),
  },
  {
    path: `profile`,
    loadChildren: () => import(`./user-profile/profile.routes`).then(m => m.routes)
    // loadComponent: () => import(`./user-profile/user-profile.component`).then(m => m.UserProfileComponent)
  },
  {
    path: `menu`,
    loadChildren: () => import(`./menu/menu.routes`).then(m => m.routes)
  },
  {
    path: `reservations`,
    loadChildren: () => import(`./reservations/reservations.routes`).then(m => m.routes)
  },
  {
    path: `settings`,
    loadChildren: () => import(`./settings/settings.routes`).then(m => m.routes)
  }
];
