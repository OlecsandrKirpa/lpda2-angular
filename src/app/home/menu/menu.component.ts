import { Component, inject } from '@angular/core';
import { PublicNavigateMenuV1Component } from "../../../core/components/public-navigate-menu-v1/public-navigate-menu-v1.component";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [PublicNavigateMenuV1Component],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  readonly _ = inject(Title).setTitle($localize`Menu | La Porta D'Acqua`);
}
