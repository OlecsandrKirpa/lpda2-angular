import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-profile.component').then(m => m.UserProfileComponent),
    children: [
      {
        path: 'edit-email',
        loadChildren: () => import('./edit-email/edit-email.module').then(m => m.EditEmailModule)
      },
      {
        path: 'edit-password',
        loadChildren: () => import('./edit-password/edit-password.module').then(m => m.EditPasswordModule)
      },
      // {
      //   path: 'edit-mobile',
      //   loadChildren: () => import('./edit-mobile/edit-mobile.module').then(m => m.EditMobileModule)
      // },
      // {
      //   path: 'edit-anagraphic-data',
      //   loadChildren: () => import('./edit-anagraphic-data/edit-anagraphic-data.module').then(m => m.EditAnagraphicDataModule)
      // },
      {
        path: 'delete',
        loadChildren: () => import('./confirm-delete/confirm-delete.module').then(m => m.ConfirmDeleteModule)
      }
    ]
  },
]
