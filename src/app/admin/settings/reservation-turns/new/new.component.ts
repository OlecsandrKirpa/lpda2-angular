import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { ReservationTurnFormComponent } from "../../../../../core/components/reservation-turn-form/reservation-turn-form.component";
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ReservationTurnsService } from '@core/services/http/reservation-turns.service';
import { NotificationsService } from '@core/services/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { HttpErrorResponse } from '@angular/common/http';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ReservationTurnFormComponent],
  templateUrl: './new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class NewComponent {
  private readonly destroy$ = inject(TuiDestroyService);
  private readonly service = inject(ReservationTurnsService);
  private readonly notifications = inject(NotificationsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly _ = inject(Title).setTitle($localize`Nuovo turno di prenotazioni | La Porta D'Acqua`);

  @ViewChild(ReservationTurnFormComponent)
  form?: ReservationTurnFormComponent;


  readonly loading: WritableSignal<boolean> = signal<boolean>(false);

  create(data: Record<string, unknown>): void {
    if (this.loading()) return;

    this.loading.set(true);

    this.service.create(data).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        this.notifications.fireSnackBar($localize`Turno creato.`);
        this.close();
      },
      error: (error: unknown) => {
        if (this.form && error instanceof HttpErrorResponse) {
          this.form.manageHttpError(error);
        } else {
          console.error(error);
          this.notifications.error(error instanceof HttpErrorResponse ? parseHttpErrorMessage(error) : SOMETHING_WENT_WRONG_MESSAGE);
        }
      }
    })
  }

  cancel(): void {
    if (!(confirm($localize`Sei sicuro di voler annullare?`))) return;

    this.close();
  }
  
  private close(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
