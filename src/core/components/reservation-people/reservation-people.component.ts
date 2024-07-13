import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {TuiHintModule} from "@taiga-ui/core";

@Component({
  selector: 'app-reservation-people',
  standalone: true,
  imports: [
    MatIcon,
    TuiHintModule
  ],
  templateUrl: './reservation-people.component.html',
})
export class ReservationPeopleComponent {
  @Input({required: true}) adults?: number;
  @Input({required: true}) children?: number;
}
