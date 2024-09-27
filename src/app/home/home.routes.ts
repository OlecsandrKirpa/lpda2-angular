import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./home/home.component`).then(m => m.HomeComponent),
  },
  {
    path: `cr/:secret`,
    loadComponent: () => import(`./cancel-reservation/cancel-reservation.component`).then(m => m.CancelReservationComponent)
  },
  {
    path: `r/:secret/:outcome`,
    loadComponent: () => import(`./view-reservation/view-reservation.component`).then(m => m.ViewReservationComponent),
  },
  {
    path: `r/:secret`,
    loadComponent: () => import(`./view-reservation/view-reservation.component`).then(m => m.ViewReservationComponent),
  },
  {
    path: `menu`,
    loadComponent: () => import(`./menu/menu.component`).then(m => m.MenuComponent),
  },
  {
    path: `about`,
    loadComponent: () => import(`./about/about.component`).then(m => m.AboutComponent),
  },
  {
    path: `reserve`,
    loadComponent: () => import(`./reserve/reserve.component`).then(m => m.ReserveComponent),
  },
];