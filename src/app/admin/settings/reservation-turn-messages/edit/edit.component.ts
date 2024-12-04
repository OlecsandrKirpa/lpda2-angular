import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReservationTurnMessageFormComponent } from "@core/components/reservation-turn-message-form/reservation-turn-message-form.component";
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { ReservationTurn } from '@core/models/reservation-turn';
import { ReservationTurnMessage } from '@core/models/reservation-turn-message';
import { ReservationTurnMessagesService } from '@core/services/http/reservation-turn-messages.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReservationTurnMessageFormComponent],
  templateUrl: './edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
  ],
})
export class EditComponent {

  private readonly service = inject(ReservationTurnMessagesService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  readonly _ = inject(Title).setTitle($localize`Modifica messaggio alla prenotazione | La Porta D'Acqua`);

  readonly item: WritableSignal<ReservationTurnMessage | null> = signal(null);
  readonly loading: WritableSignal<boolean> = signal(false);
  private itemId: number | null = null;

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (p: Params) => {
        this.itemId = Number(p["id"]);
        if (!isNaN(this.itemId)) {
          this.load(this.itemId);
        } else {
          this.item.set(null);
        }
      }
    })
  }

  submit(data: { from_date?: TuiDay | null, to_date?: TuiDay | null, translations: Record<string, string>, turns?: ReservationTurn[] }) {
    if (!(this.itemId)) return;
    if (this.loading()) return;

    this.loading.set(true);
    this.service.update(this.itemId, {
      from_date: data.from_date ? data.from_date.toString("YMD") : undefined,
      to_date: data.to_date ? data.to_date.toString("YMD") : undefined,
      message: data.translations,
      turn_ids: (data.turns || []).map((k: ReservationTurn) => k.id).filter((k: unknown): k is number => typeof k == "number" && k > 0)
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (item: ReservationTurnMessage) => {
        this.notifications.fireSnackBar($localize`Aggiornato.`);
        this.router.navigate([`..`], { relativeTo: this.route });
      },
      error: (e: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(e));
      }
    });
  }

  close(): void {
    this.router.navigate([`../`], { relativeTo: this.route });
  }

  private load(id: number): void {
    this.loading.set(true);
    this.service.show(id).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (item: ReservationTurnMessage) => this.item.set(item),
    })
  }
}
