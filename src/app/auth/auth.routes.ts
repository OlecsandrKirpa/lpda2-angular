import {Route, Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import(`./pages/login/login.component`).then(m => m.LoginComponent)
  },
  {
    path: `reset-password`,
    loadComponent: () => import(`./pages/require-reset-password/require-reset-password.component`).then(m => m.RequireResetPasswordComponent)
  },
  {
    path: `reset-password/:code`,
    loadComponent: () => import(`./pages/reset-password/reset-password.component`).then(m => m.ResetPasswordComponent)
  },
  {
    path: 'login',
    redirectTo: '',
    pathMatch: 'full'
  }
];