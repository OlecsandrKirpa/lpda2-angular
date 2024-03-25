import {
  Component,
  computed,
  inject,
  Input,
  OnChanges,
  Signal,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core';
import {Reservation} from "@core/models/reservation";
import {ReservationsService} from "@core/services/http/reservations.service";
import {NotificationsService} from "@core/services/notifications.service";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {DeliveredEmail} from "@core/models/delivered-email";
import {TuiButtonModule, TuiHintModule, TuiHostedDropdownModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, JsonPipe, NgClass} from "@angular/common";
import {HumanizeEventTypePipe} from "@core/pipes/humanize-event-type.pipe";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";

@Component({
  selector: 'app-reservation-events',
  standalone: true,
  imports: [
    TuiButtonModule,
    MatIcon,
    TuiHintModule,
    TuiHostedDropdownModule,
    DatePipe,
    JsonPipe,
    HumanizeEventTypePipe,
    NgClass
  ],
  templateUrl: './reservation-events.component.html',
})
export class ReservationEventsComponent implements OnChanges {
  private readonly service: ReservationsService = inject(ReservationsService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  @Input({required: true}) reservation?: Reservation | null;

  readonly emails: WritableSignal<DeliveredEmail[]> = signal([]);

  readonly loading: WritableSignal<boolean> = signal(false);

  readonly emailOpenAtLeastOnce: Signal<boolean> = computed((): boolean => {
    const emails = this.emails();
    let found = false;
    emails.forEach((email: DeliveredEmail): any => {
      email.image_pixels?.forEach((pixel): any => {
        if (pixel.event_type === 'email_open' && pixel.events && pixel.events.length > 0) found = true;
      });
    });

    return found;
  });

  resendEmail(): void {
    const id: number | undefined = this.reservation?.id;
    if (!(id)) return;

    this.loading.set(true);
    this.service.deliverConfirmationEmail(id).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (item: Reservation) => {
        this.notifications.fireSnackBar($localize`Email inviata`);
        this.setEmailsByReservation(item);
      },
      error: (error: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(error) ?? $localize`Qualcosa è andato storto. Riprova più tardi.`)
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservation']) this.setEmailsByReservation(changes['reservation'].currentValue);
  }

  private setEmailsByReservation(reservation: Reservation | null | undefined): void {
    this.emails.set(reservation?.delivered_emails ?? []);
  }
}
