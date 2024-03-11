import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./admin-allergens-home/admin-allergens-home.component`).then(m => m.AdminAllergensHomeComponent),
    children: [
      {
        path: `new`,
        loadChildren: () => import(`./new-allergen/new-allergen.module`).then(m => m.NewAllergenModule)
      },
      {
        path: `:id`,
        loadChildren: () => import(`./edit-allergen/edit-allergen.module`).then(m => m.EditAllergenModule)
      }
    ]
  }
];