import { Component, Input } from '@angular/core';
import { ReservationStatus, ReservationStatusTranslations } from '@core/lib/interfaces/reservation-data';

@Component({
  selector: 'app-reservation-status',
  standalone: true,
  imports: [],
  templateUrl: './reservation-status.component.html',
  styleUrl: './reservation-status.component.scss'
})
export class ReservationStatusComponent {
  @Input({required: true}) status?: ReservationStatus | null;

  readonly translations: Record<ReservationStatus, { title: string }> = ReservationStatusTranslations;
  // readonly translations: Record<ReservationStatus, { title: string }> = {
  //   active: {
  //     title: $localize`In attesa`
  //   },
  //   arrived: {
  //     title: $localize`Arrivato`
  //   },
  //   cancelled: {
  //     title: $localize`Annullato`
  //   },
  //   deleted: {
  //     title: $localize`Eliminato`
  //   },
  //   noshow: {
  //     title: $localize`No show`
  //   }
  // };
}
