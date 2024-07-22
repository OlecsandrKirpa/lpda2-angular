import { Component } from '@angular/core';
import {
  PublicReservationFormComponent
} from "@core/components/public-reservation-form/public-reservation-form.component";
import {PublicMessageComponent} from "@core/components/public-message/public-message.component";
import {
  PublicCreateOrShowReservationComponent
} from "@core/components/public-create-or-show-reservation/public-create-or-show-reservation.component";

@Component({
  selector: 'app-public-home-reserve',
  standalone: true,
  imports: [
    PublicReservationFormComponent,
    PublicMessageComponent,
    PublicCreateOrShowReservationComponent
  ],
  templateUrl: './public-home-reserve.component.html',
  styleUrl: './public-home-reserve.component.scss'
})
export class PublicHomeReserveComponent {

}
