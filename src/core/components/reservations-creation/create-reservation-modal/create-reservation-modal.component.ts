import {Component, Inject} from '@angular/core';
import {
  CreateReservationComponent
} from "@core/components/reservations-creation/create-reservation/create-reservation.component";
import {Reservation} from "@core/models/reservation";
import {TuiDialogContext, TuiDialogService} from "@taiga-ui/core";
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';


/**
 * https://taiga-ui.dev/components/dialog#data
 */
@Component({
  selector: 'app-create-reservation-modal',
  standalone: true,
  imports: [
    CreateReservationComponent
  ],
  template: `
    <app-create-reservation (created)="created($event)" (cancelled)="cancelled()"></app-create-reservation>`
})
export class CreateReservationModalComponent {
  constructor(
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<Reservation | null>,
  ) {}

  created(res: Reservation) {
    this.context.completeWith(res);
  }

  cancelled(): void {
    this.context.completeWith(null);
  }
}
