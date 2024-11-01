import { WeekDay } from '@angular/common';
import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TuiButtonModule, TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core';
import { WeekdayPipe } from "../../../../../core/pipes/weekday.pipe";
import { ReservationTurn } from '@core/models/reservation-turn';
import { SearchResult } from '@core/lib/search-result.model';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ReservationTurnsService } from '@core/services/http/reservation-turns.service';
import { filter, finalize, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from '@core/services/notifications.service';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { NoItemsComponent } from "../../../../../core/components/no-items/no-items.component";
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    TuiButtonModule,
    MatIconModule,
    TuiLoaderModule,
    WeekdayPipe,
    NoItemsComponent,
    RouterModule,
    TuiLinkModule,
],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly service: ReservationTurnsService = inject(ReservationTurnsService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly router = inject(Router);

  readonly _ = inject(Title).setTitle($localize`Turni di prenotazioni | La Porta D'Acqua`);

  readonly weekdays: string[] = Array.from({ length: 7 }, (_, i) => `${i}`);

  readonly loading: WritableSignal<boolean> = signal<boolean>(false);

  readonly data: WritableSignal<SearchResult<ReservationTurn> | null> = signal<SearchResult<ReservationTurn> | null>(null);
  readonly items = computed(() => {
    return (this.data()?.items ?? []).sort((a: ReservationTurn, b: ReservationTurn) => {
      if (!(a.starts_at && b.starts_at)) return 0;

      const aStartAt = Number(a.starts_at?.split(':')[0]);
      const bStartAt = Number(b.starts_at?.split(':')[0]);

      return aStartAt - bStartAt;
    })
  }
  );
  readonly itemsByWeekday = computed(() => this.items().reduce((acc: Record<string, ReservationTurn[]>, item: ReservationTurn) => {
    if (item.weekday != undefined && item.weekday != null) {
      const wday = `${item.weekday}`;
      acc[wday] ||= [];
      acc[wday].push(item);
    }

    return acc;
  }, {}));

  ngOnInit() {
    this.search();

    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter((event: unknown): event is NavigationEnd => event instanceof NavigationEnd),
    ).subscribe({
      next: () => this.search()
    })
  }

  delete(itemId: unknown): void {
    if (!(typeof itemId == "number" && itemId > 0)) {
      console.error(`Invalid item id: ${itemId}`);
      this.notifications.error(SOMETHING_WENT_WRONG_MESSAGE);
      return;
    }

    this.notifications.confirm($localize`Sei sicuro di voler cancellare questo turno?`).subscribe({
      next: (confirmed: boolean): void => {
        if (confirmed) this.confirmedDelete(itemId);
      }
    });
  }

  private confirmedDelete(id: number): void {
    this.loading.set(true);
    this.service.destroy(id).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.loading.set(false);
        this.search();
      }),
    ).subscribe({
      error: (error: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(error) || SOMETHING_WENT_WRONG_MESSAGE);
      }
    })
  }

  private search(): void {
    this.loading.set(true);

    this.service.search({per_page: 1000}).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data: SearchResult<ReservationTurn>) => this.data.set(data),
      error: (e: HttpErrorResponse) => {
        this.data.set(null);
        this.notifications.error(parseHttpErrorMessage(e) || SOMETHING_WENT_WRONG_MESSAGE);
      }
    })
  }
}
