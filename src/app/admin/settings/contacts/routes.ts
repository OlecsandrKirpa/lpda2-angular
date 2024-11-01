import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./list/list.component`).then(m => m.ListComponent),
    children: [
      {
        path: `:key`,
        loadChildren: () => import(`./update/update.module`).then(m => m.UpdateModule)
      }
    ]
  }
];