import {
  Component,
  computed,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core';
import {RouterLink} from "@angular/router";
import {
  TuiButtonModule,
  TuiDataListModule, TuiDropdownContextDirective,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiLinkModule, TuiLoaderModule, TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {SearchResult} from "@core/lib/search-result.model";
import {MenuCategory} from "@core/models/menu-category";
import {TuiActionModule, TuiInputModule, TuiIslandModule} from "@taiga-ui/kit";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import {TuiAutoFocusModule, TuiDestroyService} from "@taiga-ui/cdk";
import {debounceTime, distinctUntilChanged, finalize, Subscription, takeUntil, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationsService} from "@core/services/notifications.service";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {ShowImageComponent} from "@core/components/show-image/show-image.component";
import {UrlToPipe} from "@core/pipes/url-to.pipe";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";

@Component({
  selector: 'app-list-categories',
  standalone: true,
  imports: [
    RouterLink,
    TuiLinkModule,
    MatIcon,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiIslandModule,
    NgForOf,
    TuiActionModule,
    TuiDropdownModule,
    TuiDataListModule,
    NgIf,
    ShowImageComponent,
    UrlToPipe,
    ReactiveFormsModule,
    TuiInputModule,
    TuiAutoFocusModule,
    TuiTextfieldControllerModule,
    TuiLoaderModule,
    NgClass,
    TuiTablePaginationModule,
  ],
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.scss',
  providers: [
    MenuCategoriesService,
  ]
})
export class ListCategoriesComponent implements OnInit, OnChanges {
  private readonly service = inject(MenuCategoriesService);
  private readonly destroy$ = inject(TuiDestroyService);
  private readonly notifications = inject(NotificationsService);

  readonly data: WritableSignal<SearchResult<MenuCategory> | null> = signal(null);
  readonly items = computed(() => this.data()?.items ?? []);
  readonly searching: WritableSignal<boolean> = signal(false);
  readonly filtering: WritableSignal<boolean> = signal(false);

  readonly filters: FormGroup = new FormGroup({
    query: new FormControl(null),
  });

  offset: number = 0;
  per_page: number = 10;

  @Input() parentCategoryId?: number | null = null;

  ngOnInit(): void {
    this.search();
    this.filters.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      debounceTime(200),
      tap(() => this.offset = 0),
    ).subscribe({next: () => this.search()});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentCategoryId']) this.search();
  }

  triggerFiltering(): void {
    this.filtering.set(!this.filtering());

    this.search();
  }

  triggerOrdering(): void {
    this.notifications.error('Not implemented yet');
    // this.ordering.set(!this.ordering());
  }

  submitFilters(): void {
    this.search();
  }

  paginationChange($event: TuiTablePagination): void {
    this.per_page = $event.size;
    this.offset = $event.page;

    this.search();
  }

  private searchSub?: Subscription;

  private search(filters: Record<string, string | number> = this.parseFilters()): void {
    this.searchSub?.unsubscribe();

    this.searching.set(true);
    this.searchSub = this.service.search(filters).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.searching.set(false))
    ).subscribe({
      next: result => this.data.set(result),
      error: (r: HttpErrorResponse) => {
        this.data.set(null);
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto. Riprova più tardi.`);
      }
    })
  }

  private parseFilters(): Record<string, string | number> {
    const filters = this.filters.value;
    const result: Record<string, string | number> = {per_page: this.per_page, offset: this.offset};

    if (this.filtering()) {
      if (filters['query']) result['query'] = filters['query'];
    }

    result['parent_id'] = this.parentCategoryId ?? ``;

    return result;
  }

  confirmBeforeDelete(item: MenuCategory) {
    this.notifications.error('Not implemented yet');
  }

  remove(item: MenuCategory) {
    this.notifications.error('Not implemented yet');
    /**
     * TODO:
     * if there is a parentCategoryId, ask if want to remove element from this category or want to delete item completely.
     * if there is no parentCategoryId, ask confirmation and delete item completely.
     */
  }
}
