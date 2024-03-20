import { Component } from '@angular/core';
import {ListItemsComponent} from "@core/components/menu-dashboard/list-items/list-items.component";
import {RouterOutlet} from "@angular/router";
import {
  CategoryBreadcrumbsComponent
} from "@core/components/menu-dashboard/category-breadcrumbs/category-breadcrumbs.component";

@Component({
  selector: 'app-menu-root',
  standalone: true,
  imports: [
    ListItemsComponent,
    RouterOutlet,
    CategoryBreadcrumbsComponent
  ],
  templateUrl: './menu-root.component.html',
  styleUrl: './menu-root.component.scss'
})
export class MenuRootComponent {

}
