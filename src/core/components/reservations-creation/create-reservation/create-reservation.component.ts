import {Component, EventEmitter, inject, Output, signal, ViewChild, WritableSignal} from '@angular/core';
import {ReservationsService} from "@core/services/http/reservations.service";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {MatIcon} from "@angular/material/icon";
import {TuiButtonModule} from "@taiga-ui/core";
import {ActivatedRoute} from "@angular/router";
import {NotificationsService} from "@core/services/notifications.service";
import {Reservation} from "@core/models/reservation";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {
  AdminReservationFormComponent
} from "@core/components/reservations-creation/admin-reservation-form/admin-reservation-form.component";

/**
 * Create a new reservation.
 * Extremely common: does only save record to database, then emits `created(<newRecord>)`
 * If creation cancelled, emits `cancelled(<void>)`
 */
@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [
    AdminReservationFormComponent,
    MatIcon,
    TuiButtonModule
  ],
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.scss',
  providers: [
    TuiDestroyService
  ]
})
export class CreateReservationComponent {
  private readonly service: ReservationsService = inject(ReservationsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly loading: WritableSignal<boolean> = signal(false);

  @ViewChild(AdminReservationFormComponent) formComponent?: AdminReservationFormComponent;

  @Output() readonly created: EventEmitter<Reservation> = new EventEmitter<Reservation>();
  @Output() readonly cancelled: EventEmitter<void> = new EventEmitter<void>();

  submit(formVal: Record<string, any>): void {
    this.loading.set(true);
    this.service.create(formVal).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (item: Reservation): void => {
        this.notifications.fireSnackBar($localize`Prenotazione salvata`);
        this.created.emit(item);
      },
      error: (errors: HttpErrorResponse): void => {
        if (this.formComponent) ReactiveErrors.assignErrorsToForm(this.formComponent.form, errors);
        this.notifications.error(parseHttpErrorMessage(errors) || $localize`Qualcosa è andato storto nel salvataggio.`);
      }
    });
  }

  cancel(): void {
    if (confirm($localize`Sei sicuro di voler annullare?`)) this.cancelled.emit();
  }
}
