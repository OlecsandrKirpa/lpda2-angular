import { CurrencyPipe, JsonPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Input, Signal, signal, WritableSignal } from '@angular/core';
import { Reservation } from '@core/models/reservation';
import { ReservationPayment } from '@core/models/reservation-payment';
import { TuiButtonModule, TuiDialogService, TuiLinkModule } from '@taiga-ui/core';
import {TuiDialogContext } from '@taiga-ui/core';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import { CopyContentComponent } from "../copy-content/copy-content.component";
import { ReservationPaymentStatus } from '@core/lib/interfaces/reservation-payment-data';
import { ReservationsService } from '@core/services/http/reservations.service';
import { NotificationsService } from '@core/services/notifications.service';
import { takeUntil, finalize, switchMap } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { HttpErrorResponse } from '@angular/common/http';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';

@Component({
  selector: 'app-admin-reservation-payment',
  standalone: true,
  imports: [
    TuiButtonModule,
    CopyContentComponent,
    TuiLinkModule,
    CurrencyPipe,
    NgTemplateOutlet,
],
  templateUrl: './admin-reservation-payment.component.html',
  styleUrl: './admin-reservation-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class AdminReservationPaymentComponent {
  private readonly destroy = inject(TuiDestroyService);
  private readonly dialogs: TuiDialogService = inject(TuiDialogService);
  private readonly reservations: ReservationsService = inject(ReservationsService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly reservation: WritableSignal<Reservation | null> = signal(null);
  readonly payment: WritableSignal<ReservationPayment | null> = signal(null);
  readonly status: Signal<ReservationPaymentStatus | null> = computed(() => this.payment()?.status || null);

  readonly loading: WritableSignal<boolean> = signal(false);

  @Input({required: true, alias: 'reservation'}) set reservationValue(value: Reservation | null) {
    this.reservation.set(value);
    this.payment.set(value?.payment || null);
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }

  cancelPayment() {
    const id = this.reservation()?.id;
    if (!(id)) {
      this.notifications.error();
      return;
    }

    this.notifications.confirm($localize`I soldi della prenotazione verranno ritornati al cliente. Sei sicuro?`).subscribe({next: (confirmed: boolean) => {
      if (!confirmed) return;

      this.loading.set(true);
      this.reservations.refoundPayment(id).pipe(
        takeUntil(this.destroy),
        finalize(() => this.loading.set(false)),
        switchMap(() => this.reservations.show(id))
      ).subscribe((reservation: Reservation) => {
        this.reservationValue = reservation;
      }, (e: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(e));
      });

    }})
  }
}
