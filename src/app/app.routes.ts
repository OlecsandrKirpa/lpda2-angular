import {Routes} from '@angular/router';
import {adminRoutesGuard} from "@core/guards/admin-routes.guard";

export const routes: Routes = [
  {
    path: ``,
    loadChildren: () => import(`./home/home.routes`).then(m => m.routes),
  },
  {
    path: `dev`,
    loadChildren: () => import(`./dev/dev.routes`).then(m => m.routes),
  },
  {
    path: `admin`,
    loadComponent: () => import(`./admin/admin-layout/admin-layout.component`).then(m => m.AdminLayoutComponent),
    loadChildren: () => import(`./admin/admin.routes`).then(m => m.routes),
    canActivate: [adminRoutesGuard],
  },
  {
    path: `auth`,
    loadChildren: () => import(`./auth/auth.routes`).then(m => m.routes),
  }
];
