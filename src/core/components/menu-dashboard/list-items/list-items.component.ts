import {Component, Input} from '@angular/core';
import {MenuCategory} from "@core/models/menu-category";
import {TuiButtonModule, TuiHostedDropdownModule, TuiLinkModule} from "@taiga-ui/core";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {ListCategoriesComponent} from "@core/components/menu-dashboard/list-categories/list-categories.component";
import {ListDishesComponent} from "@core/components/menu-dashboard/list-dishes/list-dishes.component";

@Component({
  selector: 'app-list-items',
  standalone: true,
  imports: [
    TuiButtonModule,
    RouterLink,
    MatIcon,
    TuiLinkModule,
    TuiHostedDropdownModule,
    ListCategoriesComponent,
    ListDishesComponent,
    RouterOutlet
  ],
  templateUrl: './list-items.component.html',
  host: {
    "class": "grow flex flex-col md:flex-row"
  }
})
export class ListItemsComponent {
  @Input() parent: MenuCategory | null = null;
}
