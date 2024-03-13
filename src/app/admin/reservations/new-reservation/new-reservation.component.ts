import {Component, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {AdminReservationFormComponent} from "@core/components/admin-reservation-form/admin-reservation-form.component";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ActivatedRoute, Router} from "@angular/router";
import {ReservationsService} from "@core/services/http/reservations.service";
import {NotificationsService} from "@core/services/notifications.service";
import {TagFormComponent} from "@core/components/tag-form/tag-form.component";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {MatIcon} from "@angular/material/icon";
import {TuiButtonModule} from "@taiga-ui/core";
import {Reservation} from "@core/models/reservation";

@Component({
  selector: 'app-new-reservation',
  standalone: true,
  imports: [
    AdminReservationFormComponent,
    MatIcon,
    TuiButtonModule
  ],
  templateUrl: './new-reservation.component.html',
  providers: [
    TuiDestroyService
  ]
})
export class NewReservationComponent {
  private readonly service: ReservationsService = inject(ReservationsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly loading: WritableSignal<boolean> = signal(false);

  @ViewChild(AdminReservationFormComponent) formComponent?: AdminReservationFormComponent;

  submit(formVal: Record<string, any>): void {
    this.loading.set(true);
    this.service.create(formVal).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (item: Reservation): void => {
        this.notifications.fireSnackBar($localize`Prenotazione salvata`);
        this.router.navigate([`..`], {relativeTo: this.route});
      },
      error: (errors: HttpErrorResponse): void => {
        if (this.formComponent) ReactiveErrors.assignErrorsToForm(this.formComponent.form, errors);
        this.notifications.error(parseHttpErrorMessage(errors) || $localize`Qualcosa è andato storto nel salvataggio.`);
      }
    });
  }

  cancel(): void {
    // if (!(this.form.touched || this.form.dirty)) return this.navigateBack();

    if (confirm($localize`Sei sicuro di voler annullare?`)) this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['..'], {relativeTo: this.route});
  }
}
