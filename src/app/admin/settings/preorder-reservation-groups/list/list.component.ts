import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { SearchResult } from '@core/lib/search-result.model';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil, finalize, filter } from 'rxjs';
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';
import { PreorderReservationGroupsService } from '@core/services/http/preorder-reservation-groups.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { TuiTablePagination, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';
import { PreorderReservationGroupStatusComponent } from '@core/components/preorder-reservation-group-status/preorder-reservation-group-status.component';
import { PreorderReservationGroupPreorderTypeComponent } from '@core/components/preorder-reservation-group-preorder-type/preorder-reservation-group-preorder-type.component';

interface GroupsFilters {
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
    PreorderReservationGroupStatusComponent,
    PreorderReservationGroupPreorderTypeComponent,
    TuiLinkModule,
    TuiButtonModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ],
})
export class ListComponent implements OnInit {
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly data: WritableSignal<SearchResult<PreorderReservationGroup> | null> = signal(null);
  readonly items: Signal<PreorderReservationGroup[]> = computed(() => this.data()?.items || []);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly service: PreorderReservationGroupsService = inject(PreorderReservationGroupsService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  readonly _ = inject(Title).setTitle($localize`Pagamenti alla prenotazione | La Porta D'Acqua`);

  readonly inputSize: "s" | "m" | "l" = 'm';

  filters: Partial<GroupsFilters> = {};

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

    this.notifications.confirm($localize`Sei sicuro di voler cancellare questo pagamento?`).subscribe({
      next: (confirmed: boolean): void => {
        if (confirmed) this.confirmedDelete(itemId);
      }
    });
  }

  filtersChanged(filters: Partial<GroupsFilters>): void {
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

  private search(filters: Partial<GroupsFilters> = this.filters): void {
    filters ||= {};
    filters = {...filters};

    this.loading.set(true);
    this.service.search(filters).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (result: SearchResult<PreorderReservationGroup>) => {
        this.data.set(result);
      },
      error: (error: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(error) || $localize`Qualcosa è andato storto nella ricerca.`);
        console.error(error);
      }
    });
  }
}
