import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./home/home.component`).then(m => m.HomeComponent),
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