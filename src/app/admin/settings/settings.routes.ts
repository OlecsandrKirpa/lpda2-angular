import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./admin-settings-home/admin-settings-home.component`).then(m => m.AdminSettingsHomeComponent),
  },
  {
    path: `users`,
    loadChildren: () => import(`./users/users.routes`).then(m => m.routes)
  },
  {
    path: `preferences`,
    loadChildren: () => import(`./preferences/preferences.routes`).then(m => m.routes)
  },
  {
    path: `settings`,
    loadChildren: () => import(`./settings/settings.routes`).then(m => m.routes)
  },
  {
    path: `public_messages`,
    loadChildren: () => import(`./public_messages/public_messages.routes`).then(m => m.routes)
  },
  {
    path: `preorder_reservation_groups`,
    loadChildren: () => import(`./preorder-reservation-groups/routes`).then(m => m.routes)
  }
];