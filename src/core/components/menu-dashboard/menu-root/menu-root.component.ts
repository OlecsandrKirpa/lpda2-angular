import { Component } from '@angular/core';
import {ListItemsComponent} from "@core/components/menu-dashboard/list-items/list-items.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-menu-root',
  standalone: true,
  imports: [
    ListItemsComponent,
    RouterOutlet
  ],
  templateUrl: './menu-root.component.html',
  styleUrl: './menu-root.component.scss'
})
export class MenuRootComponent {

}
