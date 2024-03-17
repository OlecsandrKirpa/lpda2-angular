import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output, signal,
  WritableSignal
} from '@angular/core';
import {TuiButtonModule, TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiAutoFocusModule, TuiDestroyService} from "@taiga-ui/cdk";
import {RouterLink} from "@angular/router";
import {
  ReservationStatusSelectComponent
} from "@core/components/reservation-status-select/reservation-status-select.component";
import {
  ReservationTurnSelectComponent
} from "@core/components/dynamic-selects/reservation-turn-select/reservation-turn-select.component";
import {
  ReservationDateSelectComponent
} from "@core/components/reservation-date-select/reservation-date-select.component";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {Reservation} from "@core/models/reservation";
import {SearchResult} from "@core/lib/search-result.model";
import {DatePipe, JsonPipe} from "@angular/common";
import {ReservationTurn} from "@core/models/reservation-turn";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ReservationStatus} from "@core/lib/interfaces/reservation-data";
import {debounceTime, distinctUntilChanged, filter, takeUntil} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {strToUTC} from "@core/lib/str-time-timezone";

// export type ReservationsFilters = ReservationsFiltersWithDate | ReservationsFiltersWithDatetime;

export interface ReservationsFilters {
  query: string;
  status: ReservationStatus;
  date: string;
  datetime_from: string;
  datetime_to: string;
  order_by_field: string;
  order_by_direction: "ASC" | "DESC";
}

@Component({
  selector: 'app-list-reservations-filters',
  standalone: true,
  imports: [
    TuiButtonModule,
    MatIcon,
    TuiInputModule,
    TuiAutoFocusModule,
    TuiLinkModule,
    RouterLink,
    ReservationStatusSelectComponent,
    ReservationTurnSelectComponent,
    ReservationDateSelectComponent,
    TuiTablePaginationModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './list-reservations-filters.component.html',
  providers: [
    TuiDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListReservationsFiltersComponent implements OnInit, AfterViewInit {
  @Input() loading: boolean = false;
  @Input({required: true}) data: SearchResult<Reservation> | null = null;

  @Input() inputSize: 's' | 'm' | 'l' = 'm';

  @Output() readonly filtersChanged: EventEmitter<Partial<ReservationsFilters>> = new EventEmitter<Partial<ReservationsFilters>>();
  // @Output() readonly submit: EventEmitter<void> = new EventEmitter<void>();

  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly datePipe: DatePipe = inject(DatePipe);

  readonly query: FormControl<string | null> = new FormControl<string | null>(null);
  readonly turn: FormControl<ReservationTurn | null> = new FormControl<ReservationTurn | null>(null);
  readonly date: FormControl<Date | null> = new FormControl<Date | null>(new Date());
  readonly status: FormControl<ReservationStatus | null> = new FormControl<ReservationStatus | null>(`active`);

  // Date formatted as string
  readonly dateStr: WritableSignal<string | null> = signal(this.formatDate(this.date.value));

  private offset: number = 0;
  private per_page: number = 10;

  constructor() {
  }

  ngOnInit(): void {
    // Listen date change to update dateStr.
    this.date.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (date: Date | null): void => {
        this.dateStr.set(this.formatDate(date));
      },
      error: (error: any) => console.error(error),
    });

    // Absolute filters:
    // When changed, query again immediately.
    [
      this.date,
      this.turn,
      this.status
    ].map((control: FormControl): void => {
      control.valueChanges.pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        filter(() => control.valid),
      ).subscribe({
        next: (): void => {
          this.offset = 0;
          this.filtersMayHaveChanged();
        },
      });
    });

    // Wait some time before querying again.
    [
      this.query
    ].map((control: FormControl): void => {
      control.valueChanges.pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(500),
        filter(() => control.valid),
      ).subscribe({
        next: (): void => {
          this.offset = 0;
          this.filtersMayHaveChanged();
        },
      });
    });
  }

  ngAfterViewInit(): void {
    this.emitCurrentFilters();
  }

  submit(): void {
    this.emitCurrentFilters();
  }

  mergeFilters(newFilters: Record<string, string>): void {
    // TODO:
    // from outside should be able to call this method to merge some filter
  }

  setFilters(newFilters: Record<string, string>): void {
    // TODO:
    // from outside should be able to call this method to set filters
  }

  // Calculating current filters here.
  currentFilters(): Partial<ReservationsFilters> {
    const filters: Partial<ReservationsFilters> = {};
    if (typeof this.query.value == 'string' && this.query.valid && this.query.value.length > 0) {
      filters['query'] = this.query.value;
    }

    // When has turn specified, use the date + turn starts_at and ends_at.
    // Otherwise, use only the date.
    if (this.date.value instanceof Date && this.date.valid) {
      const date: string | null = this.datePipe.transform(this.date.value, 'YYYY-MM-dd');
      const turn: ReservationTurn | null = this.turn.value;

      if (this.turn.valid && turn instanceof ReservationTurn && turn.starts_at && turn.ends_at) {
        filters['datetime_from'] = `${date} ${strToUTC(turn.starts_at)}`;
        filters['datetime_to'] = `${date} ${strToUTC(turn.ends_at)}`;
      } else if (date) filters['date'] = date;
    }

    if (typeof this.status.value == 'string' && this.status.valid) {
      filters.status = this.status.value;
    }

    return filters;
  }

  paginationChange(event: TuiTablePagination): void {
    this.offset = event.page;
    this.per_page = event.size;
    this.filtersMayHaveChanged();
  }

  // Will check if filters changed, and if so, will emit new filters.
  // Will return a boolean indicating if filters changed.
  private lastFilters: Partial<ReservationsFilters> = {};
  private filtersMayHaveChanged(): boolean {
    const currentFilters: Partial<ReservationsFilters> = this.currentFilters();
    const changed: boolean = JSON.stringify(currentFilters) !== JSON.stringify(this.lastFilters);
    if (changed) {
      this.lastFilters = currentFilters;
      this.emitCurrentFilters();
    }

    return changed;
  }

  private formatDate(date: Date | null): string | null {
    if (date instanceof Date) {
      return this.datePipe.transform(date, 'YYYY-MM-dd');
    }

    return null;
  }

  private emitCurrentFilters(): void {
    this.filtersChanged.emit(this.currentFilters());
  }
}
