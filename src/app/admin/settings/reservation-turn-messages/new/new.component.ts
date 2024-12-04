import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReservationTurnMessageFormComponent } from "../../../../../core/components/reservation-turn-message-form/reservation-turn-message-form.component";
import { ReservationTurnsService } from '@core/services/http/reservation-turns.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { ReservationTurnMessage } from '@core/models/reservation-turn-message';
import { ReservationTurnMessagesService } from '@core/services/http/reservation-turn-messages.service';
import { takeUntil } from 'rxjs';
import { ReservationTurn } from '@core/models/reservation-turn';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ReservationTurnMessageFormComponent],
  templateUrl: './new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class NewComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = inject(TuiDestroyService);
  private readonly notifications = inject(NotificationsService);
  private readonly service = inject(ReservationTurnMessagesService);

  readonly _ = inject(Title).setTitle($localize`Nuovo messaggio alla prenotazione | La Porta D'Acqua`);

  submit(data: { from_date?: TuiDay | null, to_date?: TuiDay | null, translations: Record<string, string>, turns?: ReservationTurn[] }) {
    this.service.create({
      from_date: data.from_date ? data.from_date.toString("YMD") : undefined,
      to_date: data.to_date ? data.to_date.toString("YMD") : undefined,
      message: data.translations,
      turn_ids: (data.turns || []).map((k: ReservationTurn) => k.id).filter((k: unknown): k is number => typeof k == "number" && k > 0)
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (item: ReservationTurnMessage) => {
        this.router.navigate([`../`, item.id], { relativeTo: this.route });
      },
      error: () => {
        this.notifications.error('messages.error');
      }
    });
  }

  close(): void {
    this.router.navigate([`../`], { relativeTo: this.route });
  }
}
