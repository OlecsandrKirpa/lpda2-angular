import { Component } from '@angular/core';
import {
  PublicReservationFormComponent
} from "@core/components/public-reservation-form/public-reservation-form.component";
import {PublicMessageComponent} from "@core/components/public-message/public-message.component";

@Component({
  selector: 'app-public-home-reserve',
  standalone: true,
  imports: [
    PublicReservationFormComponent,
    PublicMessageComponent
  ],
  templateUrl: './public-home-reserve.component.html',
  styleUrl: './public-home-reserve.component.scss'
})
export class PublicHomeReserveComponent {

}
