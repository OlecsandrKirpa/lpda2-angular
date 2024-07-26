import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {TuiLinkModule} from "@taiga-ui/core";

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    RouterLink,
    TuiLinkModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {

}
