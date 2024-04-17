import {Routes} from "@angular/router";


export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./list-users/list-users.component`).then(m => m.ListUsersComponent),
    children: [
      {
        path: `new`,
        loadChildren: () => import(`./new-user/new-user.module`).then(m => m.NewUserModule),
      },
    ]
  },
];