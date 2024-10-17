import {Routes} from "@angular/router";


export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./list/list.component`).then(m => m.ListComponent),
    children: [
      {
        path: `new`,
        loadChildren: () => import(`./new/new.module`).then(m => m.NewModule),
      },
      {
        path: `:id`,
        loadChildren: () => import(`./show/show.module`).then(m => m.ShowModule),
      },
      {
        path: `:id/edit`,
        loadChildren: () => import(`./update/update.module`).then(m => m.UpdateModule),
      }
    ]
  },
];