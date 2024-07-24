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
import {PublicMessageComponent} from "@core/components/public-message/public-message.component";
import {RouterLink} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";
import {finalize, takeUntil} from "rxjs";


@Component({
  selector: 'app-public-home-reserve',
  standalone: true,
  imports: [
    DatePipe,
    TuiButtonModule,
    PublicReservationFormComponent,
    PublicMessageComponent,
    RouterLink
  ],
  templateUrl: './public-home-reserve.component.html',
  styleUrl: './public-home-reserve.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class PublicHomeReserveComponent implements OnInit {
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly reservations: PublicReservationsService = inject(PublicReservationsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly localStorage: LocalStorageService = inject(LocalStorageService);

  readonly createdReservation: WritableSignal<Reservation | null> = signal(null);
  readonly resendingConfirmation: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.reservations.created.pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (reservation: Reservation | null): void => {
        this.createdReservation.set(reservation);
      }
    })
  }

  resendConfirmation(): void {
    const secret: string | undefined = this.createdReservation()?.secret;
    if (!secret) return;

    this.resendingConfirmation.set(true);
    this.reservations.resendConfirmation(secret).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.resendingConfirmation.set(false)),
    ).subscribe({
      next: (): void => {
        this.notifications.fireSnackBar($localize`L'email arriverà a breve.`);
      },
      error: (e: unknown) => {
        this.notifications.error(e instanceof HttpErrorResponse ? parseHttpErrorMessage(e) : SOMETHING_WENT_WRONG_MESSAGE);
      }
    });
  }
}