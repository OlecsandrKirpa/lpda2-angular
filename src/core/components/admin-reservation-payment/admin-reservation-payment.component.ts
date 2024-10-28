import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Input, signal, WritableSignal } from '@angular/core';
import { Reservation } from '@core/models/reservation';
import { ReservationPayment } from '@core/models/reservation-payment';
import { TuiButtonModule, TuiDialogService, TuiLinkModule } from '@taiga-ui/core';
import {TuiDialogContext } from '@taiga-ui/core';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import { CopyContentComponent } from "../copy-content/copy-content.component";

@Component({
  selector: 'app-admin-reservation-payment',
  standalone: true,
  imports: [
    TuiButtonModule,
    NgClass,
    CopyContentComponent,
    TuiLinkModule,
],
  templateUrl: './admin-reservation-payment.component.html',
  styleUrl: './admin-reservation-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReservationPaymentComponent {
  private readonly dialogs: TuiDialogService = inject(TuiDialogService);
  readonly reservation: WritableSignal<Reservation | null> = signal(null);
  readonly payment: WritableSignal<ReservationPayment | null> = signal(null);
  readonly paid = computed(() => this.payment()?.status === "paid");

  readonly loading: WritableSignal<boolean> = signal(false);

  @Input({required: true, alias: 'reservation'}) set reservationValue(value: Reservation | null) {
    this.reservation.set(value);
    this.payment.set(value?.payment || null);
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
}
}
