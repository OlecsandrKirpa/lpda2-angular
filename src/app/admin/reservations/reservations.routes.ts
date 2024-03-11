import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./admin-reservations-home/admin-reservations-home.component`).then(m => m.AdminReservationsHomeComponent),
    children: [
      {
        path: `new`,
        loadChildren: () => import(`./new-reservation/new-reservation.module`).then(m => m.NewReservationModule)
      },
      {
        path: `:id`,
        loadChildren: () => import(`./edit-reservation/edit-reservation.module`).then(m => m.EditReservationModule)
      }
    ]
  }
];