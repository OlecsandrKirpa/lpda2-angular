import { Component } from '@angular/core';
import { PublicNavigateMenuV1Component } from "../../../core/components/public-navigate-menu-v1/public-navigate-menu-v1.component";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [PublicNavigateMenuV1Component],
  templateUrl: './menu.component.html',
})
export class MenuComponent {

}
