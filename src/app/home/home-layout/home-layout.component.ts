import {Component, HostBinding} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {PublicNavbarComponent} from "@core/components/public-navbar/public-navbar.component";

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    PublicNavbarComponent
  ],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent {

}
