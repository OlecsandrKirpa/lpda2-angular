import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./admin-ingredients-home/admin-ingredients-home.component`).then(m => m.AdminIngredientsHomeComponent),
    children: [
      {
        path: `new`,
        loadChildren: () => import(`./new-ingredient/new-ingredient.module`).then(m => m.NewIngredientModule)
      },
      {
        path: `:id`,
        loadChildren: () => import(`./edit-ingredient/edit-ingredient.module`).then(m => m.EditIngredientModule)
      }
    ]
  }
];