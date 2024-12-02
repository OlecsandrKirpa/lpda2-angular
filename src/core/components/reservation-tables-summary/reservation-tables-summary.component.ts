import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnChanges,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {TuiDestroyService, TuiLetModule} from "@taiga-ui/cdk";
import {ReservationsService} from "@core/services/http/reservations.service";
import {finalize, takeUntil} from "rxjs";
import {JsonPipe} from "@angular/common";
import {TuiHintModule, TuiLoaderModule} from "@taiga-ui/core";
import {ReservationTableSummary, UngroupedTablesSummary} from "@core/lib/interfaces/reservation-table-summary";
import {ObjectToArrayPipe} from "@core/pipes/object-to-array.pipe";
import { ReservationsFilters } from '../list-reservations-filters/list-reservations-filters.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reservation-tables-summary',
  standalone: true,
  imports: [
    TuiLoaderModule,
    TuiHintModule,
    MatIconModule,
  ],
  templateUrl: './reservation-tables-summary.component.html',
  styleUrls: ['./reservation-tables-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class ReservationTablesSummaryComponent implements OnChanges {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly service: ReservationsService = inject(ReservationsService);

  // First number is the size of the table, second number is the number of tables with that size.
  readonly data: WritableSignal<[number, number][] | null> = signal<[number, number][] | null>(null);

  readonly totalPeople = computed(() => this.data()?.reduce((acc, [size, count]) => acc + size * count, 0) || 0);

  readonly loading: WritableSignal<boolean> = signal<boolean>(false);

  /**
   * Should - when $loading is true - loader be shown?
   */
  @Input() showLoader: boolean = true;

  @Input() filters: (Record<string, string | boolean | number> & Partial<ReservationsFilters>) | null = null;

  ngOnChanges(): void {
    this.query();
  }

  private query(): void {
    this.loading.set(true);
    this.service.ungroupedTablesSummary(this.filters ?? {}).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (data: UngroupedTablesSummary): void => {
        // this.data.set(data);
        this.data.set(Object.entries(data).map(([size, count]) => [Number(size), count]));
      }
    })
  }
}
