import { Component } from '@angular/core';
import {TuiButtonModule} from "@taiga-ui/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-public-home-about',
  standalone: true,
  imports: [
    TuiButtonModule,
    RouterLink
  ],
  templateUrl: './public-home-about.component.html',
  styleUrl: './public-home-about.component.scss'
})
export class PublicHomeAboutComponent {

}
