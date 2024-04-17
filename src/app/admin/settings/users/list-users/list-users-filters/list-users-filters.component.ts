import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output, signal, WritableSignal
} from '@angular/core';
import {TuiAutoFocusModule, TuiDestroyService} from "@taiga-ui/cdk";
import {SearchResult} from "@core/lib/search-result.model";
import {DatePipe} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, filter, takeUntil} from "rxjs";
import {strToUTC} from "@core/lib/str-time-timezone";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {User} from "@core/models/user";
import {TuiButtonModule, TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {TuiInputModule} from "@taiga-ui/kit";
import {RouterLink} from "@angular/router";

export interface UsersFilters {
  query?: string;
  offset?: number;
  per_page?: number;
}

@Component({
  selector: 'app-list-users-filters',
  standalone: true,
  imports: [
    TuiButtonModule,
    MatIcon,
    TuiInputModule,
    TuiAutoFocusModule,
    ReactiveFormsModule,
    TuiTablePaginationModule,
    RouterLink,
    TuiLinkModule
  ],
  templateUrl: './list-users-filters.component.html',
  providers: [
    TuiDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUsersFiltersComponent implements OnInit, AfterViewInit {
@Input() loading: boolean = false;
  @Input({required: true}) data: SearchResult<User> | null = null;

  @Input() inputSize: 's' | 'm' | 'l' = 'm';

  @Output() readonly filtersChanged: EventEmitter<Partial<UsersFilters>> = new EventEmitter<Partial<UsersFilters>>();

  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  readonly query: FormControl<string | null> = new FormControl<string | null>(null);

  private offset: number = 0;
  private per_page: number = 10;

  ngOnInit(): void {
    // Absolute filters:
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
  currentFilters(): Partial<UsersFilters> {
    const filters: Partial<UsersFilters> = {
      offset: this.offset,
      per_page: this.per_page
    };

    if (typeof this.query.value == 'string' && this.query.valid && this.query.value.length > 0) {
      filters['query'] = this.query.value;
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
  private lastFilters: Partial<UsersFilters> = {};

  private filtersMayHaveChanged(): boolean {
    const currentFilters: Partial<UsersFilters> = this.currentFilters();
    const changed: boolean = JSON.stringify(currentFilters) !== JSON.stringify(this.lastFilters);
    if (changed) {
      this.lastFilters = currentFilters;
      this.emitCurrentFilters();
    }

    return changed;
  }

  private emitCurrentFilters(): void {
    this.filtersChanged.emit(this.currentFilters());
  }
}
