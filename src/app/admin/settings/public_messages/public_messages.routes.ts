import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./list-public-messages/list-public-messages.component`).then(m => m.ListPublicMessagesComponent),
    children: [
      {
        path: `:key`,
        loadChildren: () => import(`./edit-public-message/edit-public-message.module`).then(m => m.EditPublicMessageModule),
      }
    ]
  }
];