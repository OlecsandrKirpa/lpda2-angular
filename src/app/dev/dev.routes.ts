import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./dev/dev.component`).then(m => m.DevComponent),
  },
];
