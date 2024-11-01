import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { ReservationTurnFormComponent } from "../../../../../core/components/reservation-turn-form/reservation-turn-form.component";
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { ReservationTurnsService } from '@core/services/http/reservation-turns.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil, finalize, map, switchMap, filter, tap } from 'rxjs';
import { ReservationTurn } from '@core/models/reservation-turn';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReservationTurnFormComponent],
  templateUrl: './edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class EditComponent implements OnInit {
  private readonly destroy$ = inject(TuiDestroyService);
  private readonly service = inject(ReservationTurnsService);
  private readonly notifications = inject(NotificationsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly _ = inject(Title).setTitle($localize`Modifica turni di prenotazioni | La Porta D'Acqua`);

  @ViewChild(ReservationTurnFormComponent)
  form?: ReservationTurnFormComponent;

  readonly loading: WritableSignal<boolean> = signal<boolean>(true);

  readonly item: WritableSignal<ReservationTurn | null> = signal<ReservationTurn | null>(null);

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      // tap((...args: any) => console.log(`params`, args)),
      map((p: Params) => Number(p["id"])),
      filter((id: unknown): id is number => typeof id === "number" && id > 0 && !isNaN(id)),
      tap(() => this.loading.set(true)),
      switchMap((id: number) =>
        this.service.show(id).pipe(
          takeUntil(this.destroy$),
          finalize(() => this.loading.set(false))
        )
    ),
    ).subscribe({
      next: (item: ReservationTurn) => this.item.set(item),
      error: (e: unknown) => this.notifications.error(e instanceof HttpErrorResponse ? parseHttpErrorMessage(e) : SOMETHING_WENT_WRONG_MESSAGE)
    })
  }

  update(data: Record<string, unknown>): void {
    if (this.loading()) return;
    const id = this.item()?.id;
    if (!id) {
      console.warn(`no id`);
      return;
    }

    this.loading.set(true);

    this.service.update(id, data).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        this.notifications.fireSnackBar($localize`Modificato.`);
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
