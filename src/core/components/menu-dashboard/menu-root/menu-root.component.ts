import { Component } from '@angular/core';
import {ListItemsComponent} from "@core/components/menu-dashboard/list-items/list-items.component";
import {RouterOutlet} from "@angular/router";
import {
  CategoryBreadcrumbsComponent
} from "@core/components/menu-dashboard/category-breadcrumbs/category-breadcrumbs.component";
import {ListCategoriesComponent} from "@core/components/menu-dashboard/list-categories/list-categories.component";

@Component({
  selector: 'app-menu-root',
  standalone: true,
  imports: [
    ListItemsComponent,
    RouterOutlet,
    CategoryBreadcrumbsComponent,
    ListCategoriesComponent
  ],
  templateUrl: './menu-root.component.html',
  host: {
    "class": "grow flex flex-col"
  }
})
export class MenuRootComponent {

}
