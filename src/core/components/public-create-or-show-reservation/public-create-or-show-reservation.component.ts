import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {Reservation} from "@core/models/reservation";
import {DatePipe} from "@angular/common";
import {TuiButtonModule} from "@taiga-ui/core";
import {
  PublicReservationFormComponent
} from "@core/components/public-reservation-form/public-reservation-form.component";
import {NotificationsService} from "@core/services/notifications.service";
import {ReservationsService} from "@core/services/http/reservations.service";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {LocalStorageService} from "@core/services/local-storage.service";
import {PublicReservationsService} from "@core/services/http/public-reservations.service";

@Component({
  selector: 'app-public-create-or-show-reservation',
  standalone: true,
  imports: [
    DatePipe,
    TuiButtonModule,
    PublicReservationFormComponent
  ],
  templateUrl: './public-create-or-show-reservation.component.html',
  styleUrl: './public-create-or-show-reservation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class PublicCreateOrShowReservationComponent implements OnInit {
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly reservations: PublicReservationsService = inject(PublicReservationsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly localStorage: LocalStorageService = inject(LocalStorageService);

  readonly createdReservation: WritableSignal<Reservation | null> = signal(null);

  ngOnInit(): void {
    this.reservations.created.subscribe({
      next: (reservation: Reservation | null): void => {
        this.createdReservation.set(reservation);
      }
    })
  }
}
