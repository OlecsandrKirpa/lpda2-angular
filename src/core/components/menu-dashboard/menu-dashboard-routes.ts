import {Routes} from "@angular/router";

const categoryRoutes: Routes = [
  {
    path: `create-category`,
    loadChildren: () => import(`./create-category/create-category.module`).then(m => m.CreateCategoryModule),
  },
  {
    path: `link-category`,
    loadChildren: () => import(`./link-category/link-category.module`).then(m => m.LinkCategoryModule),
  },
  {
    path: `link-dish`,
    loadChildren: () => import(`./link-dish/link-dish.module`).then(m => m.LinkDishModule),
  },
  {
    path: `duplicate`,
    loadChildren: () => import(`./duplicate-category/duplicate-category.module`).then(m => m.DuplicateCategoryModule),
  },
  {
    path: `export`,
    loadChildren: () => import(`./export-category/export-category.module`).then(m => m.ExportCategoryModule),
  },
  {
    path: `create-dish`,
    loadChildren: () => import(`./create-dish/create-dish.module`).then(m => m.CreateDishModule),
  },
  {
    path: `dish/:dish_id/duplicate`,
    loadChildren: () => import(`./duplicate-dish/duplicate-dish.module`).then(m => m.DuplicateDishModule),
  },
  {
    path: `dish/:dish_id`,
    loadChildren: () => import(`./view-dish/view-dish.module`).then(m => m.ViewDishModule),
    pathMatch: `full`
  },
];

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./menu-root/menu-root.component`).then(m => m.MenuRootComponent),
    children: categoryRoutes
  },
  {
    path: `:category_id`,
    loadComponent: () => import(`./category-dashboard/category-dashboard.component`).then(m => m.CategoryDashboardComponent),
    children: categoryRoutes
  },
];