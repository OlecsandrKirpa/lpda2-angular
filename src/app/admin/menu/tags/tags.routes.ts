import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./admin-tags-home/admin-tags-home.component`).then(m => m.AdminTagsHomeComponent),
    children: [
      {
        path: `new`,
        loadChildren: () => import(`./new-tag/new-tag.module`).then(m => m.NewTagModule)
      },
      {
        path: `:id`,
        loadChildren: () => import(`./edit-tag/edit-tag.module`).then(m => m.EditTagModule)
      }
    ]
  }
];