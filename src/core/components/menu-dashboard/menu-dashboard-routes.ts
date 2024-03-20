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
    path: `duplicate`,
    loadChildren: () => import(`./duplicate-category/duplicate-category.module`).then(m => m.DuplicateCategoryModule),
  },
  {
    path: `export`,
    loadChildren: () => import(`./export-category/export-category.module`).then(m => m.ExportCategoryModule),
  },
] ;

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