import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { SearchResult } from '@core/lib/search-result.model';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil, finalize, filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { TuiTablePagination, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule, TuiLinkModule } from '@taiga-ui/core';
import { ReservationTurnMessage } from '@core/models/reservation-turn-message';
import { NoItemsComponent } from "../../../../../core/components/no-items/no-items.component";
import { ReservationTurnMessagesService } from '@core/services/http/reservation-turn-messages.service';
import { WeekdayPipe } from "../../../../../core/pipes/weekday.pipe";
import { DowncasePipe } from "../../../../../core/pipes/downcase.pipe";

interface filters {
  page: number;
  per_page: number;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatIconModule,
    RouterModule,
    DatePipe,
    CurrencyPipe,
    TuiTablePaginationModule,
    TuiLinkModule,
    TuiLinkModule,
    TuiButtonModule,
    NoItemsComponent,
    WeekdayPipe,
    DowncasePipe,
    TuiHostedDropdownModule,
    TuiDataListModule,
],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ],
})
export class ListComponent implements OnInit {
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly data: WritableSignal<SearchResult<ReservationTurnMessage> | null> = signal(null);
  readonly items: Signal<ReservationTurnMessage[]> = computed(() => this.data()?.items || []);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly service: ReservationTurnMessagesService = inject(ReservationTurnMessagesService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  readonly _ = inject(Title).setTitle($localize`Messaggi alla prenotazione | La Porta D'Acqua`);

  filters: Partial<filters> = {};

  ngOnInit(): void {
    this.search();

    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter((event: unknown): event is NavigationEnd => event instanceof NavigationEnd),
    ).subscribe({
      next: () => this.search()
    })
  }

  paginationChange($event: TuiTablePagination) {
    this.filters.page = $event.page;
    this.filters.per_page = $event.size;

    this.search();
  }

  delete(itemId: number | undefined): void {
    if (!(itemId)) return;

    this.notifications.confirm($localize`Sei sicuro di voler cancellare questo messaggio?`).subscribe({
      next: (confirmed: boolean): void => {
        if (confirmed) this.confirmedDelete(itemId);
      }
    });
  }

  filtersChanged(filters: Partial<filters>): void {
    this.filters = filters;
    this.search(filters);
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
        this.notifications.error(parseHttpErrorMessage(error) || $localize`Qualcosa è andato storto nella cancellazione.`);
      }
    })
  }

  private search(filters: Partial<filters> = this.filters): void {
    filters ||= {};
    filters = {...filters};

    this.loading.set(true);
    this.service.search(filters).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (result: SearchResult<ReservationTurnMessage>) => {
        this.data.set(result);
      },
      error: (error: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(error) || $localize`Qualcosa è andato storto nella ricerca.`);
        console.error(error);
      }
    });
  }
}
