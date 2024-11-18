import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-public-image-header',
  standalone: true,
  imports: [],
  templateUrl: './public-image-header.component.html',
})
export class PublicImageHeaderComponent {
  /**
   * E.g: /assets/img/public-menu-landing.webp
   */
  @Input({required: true}) image?: string;
}
