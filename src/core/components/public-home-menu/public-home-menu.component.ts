import {Component} from '@angular/core';
import {TuiButtonModule} from "@taiga-ui/core";
import {RouterLink} from "@angular/router";
import {TuiCarouselModule} from "@taiga-ui/kit";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-public-home-menu',
  standalone: true,
  imports: [
    TuiButtonModule,
    RouterLink,
    TuiCarouselModule,
    NgForOf
  ],
  templateUrl: './public-home-menu.component.html',
  styleUrl: './public-home-menu.component.scss'
})
export class PublicHomeMenuComponent {
  index = 0;

  readonly items = [
    'public-home-menu-photo1.webp',
    'public-home-menu-photo2.webp',
    'public-home-menu-photo3.webp',
    'public-home-menu-photo4.webp',
    'public-home-menu-photo5.webp',
    'public-home-menu-photo6.webp',
  ];
}
