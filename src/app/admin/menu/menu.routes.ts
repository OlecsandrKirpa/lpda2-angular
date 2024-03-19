import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: `tags`,
    loadChildren: () => import(`./tags/tags.routes`).then(m => m.routes),
  },
  {
    path: `ingredients`,
    loadChildren: () => import(`./ingredients/ingredients.routes`).then(m => m.routes),
  },
  {
    path: `allergens`,
    loadChildren: () => import(`./allergens/allergens.routes`).then(m => m.routes),
  },
  {
    path: ``,
    loadChildren: () => import(`@core/components/menu-dashboard/menu-dashboard-routes`).then(m => m.routes),
  },
];