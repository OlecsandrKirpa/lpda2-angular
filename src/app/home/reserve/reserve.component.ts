import { Component } from '@angular/core';
import {PublicHomeReserveComponent} from "@core/components/public-home-reserve/public-home-reserve.component";

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [
    PublicHomeReserveComponent
  ],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.scss'
})
export class ReserveComponent {

}
