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
}
