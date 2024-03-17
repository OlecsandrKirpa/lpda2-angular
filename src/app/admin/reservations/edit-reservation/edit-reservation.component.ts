import {Component, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {TuiButtonModule} from "@taiga-ui/core";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ReservationsService} from "@core/services/http/reservations.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NotificationsService} from "@core/services/notifications.service";
import {TagFormComponent} from "@core/components/tag-form/tag-form.component";
import {BehaviorSubject, distinctUntilChanged, filter, finalize, Observable, switchMap, takeUntil, tap} from "rxjs";
import {Reservation} from "@core/models/reservation";
import {HttpErrorResponse} from "@angular/common/http";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {nue} from "@core/lib/nue";
import {MatIcon} from "@angular/material/icon";
import {
  AdminReservationFormComponent
} from "@core/components/reservations-creation/admin-reservation-form/admin-reservation-form.component";

@Component({
  selector: 'app-edit-reservation',
  standalone: true,
  imports: [
    TuiButtonModule,
    MatIcon,
    AdminReservationFormComponent
  ],
  templateUrl: './edit-reservation.component.html',
  providers: [
    TuiDestroyService
  ]
})
export class EditReservationComponent implements OnInit {
  private readonly service: ReservationsService = inject(ReservationsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly loading: WritableSignal<boolean> = signal(false);

  @ViewChild(AdminReservationFormComponent) formComponent?: AdminReservationFormComponent;

  readonly item: WritableSignal<Reservation | null> = signal(null);

  readonly id$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  readonly item$: Observable<Reservation> = this.id$.pipe(
    takeUntil(this.destroy$),
    filter((id): id is number => id !== null),
    distinctUntilChanged(),
    switchMap((id: number) => this.service.show(id)),
    tap(() => this.loading.set(false)),
    tap((item: Reservation) => this.item.set(item))
  )

  ngOnInit(): void {
    this.item$.pipe(takeUntil(this.destroy$)).subscribe(nue());

    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (params: Params) => {
        this.id$.next(params['id']);
      }
    })
  }

  submit(formVal: Record<string, any>): void {
    const id = this.id$.value;
    if (!id) return;

    this.loading.set(true);
    this.service.update(id, formVal).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (item: Reservation): void => {
        this.notifications.fireSnackBar($localize`Prenotazione salvata`);
        this.router.navigate([`..`], {relativeTo: this.route});
      },
      error: (errors: HttpErrorResponse): void => {
        console.warn(`invalid!`, {form: this.formComponent, errors: errors})
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
