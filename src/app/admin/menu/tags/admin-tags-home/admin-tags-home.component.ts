import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiAutoFocusModule, TuiDestroyService} from "@taiga-ui/cdk";
import {TuiButtonModule, TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {SearchResult} from "@core/lib/search-result.model";
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  merge,
  Subject,
  Subscription,
  takeUntil,
  tap
} from "rxjs";
import {RouterLink, RouterOutlet} from "@angular/router";
import {ShowImageComponent} from "@core/components/show-image/show-image.component";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {nue} from "@core/lib/nue";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationsService} from "@core/services/notifications.service";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {Tag} from "@core/models/tag";
import {TagsService} from "@core/services/http/tags.service";

@Component({
  selector: 'app-admin-tags-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiAutoFocusModule,
    TuiButtonModule,
    MatIcon,
    RouterLink,
    TuiLinkModule,
    RouterOutlet,
    ShowImageComponent,
    TuiTablePaginationModule,
  ],
  templateUrl: './admin-tags-home.component.html',
  providers: [
    TuiDestroyService
  ]
})
export class AdminTagsHomeComponent implements OnInit {
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly data: WritableSignal<SearchResult<Tag> | null> = signal(null);
  readonly items: Signal<Tag[]> = computed(() => this.data()?.items || []);
  private readonly service: TagsService = inject(TagsService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  readonly form: FormGroup = new FormGroup({
    query: new FormControl(``),
    offset: new FormControl(0, [Validators.min(0), Validators.required]),
    per_page: new FormControl(10, [Validators.min(1), Validators.required]),
  });

  private readonly search$: Subject<void> = new Subject<void>();

  private readonly _filter$: Subscription = merge(
    this.form.get(`query`)!.valueChanges.pipe(
      debounceTime(1_000),
      tap(() => this.form.patchValue({offset: 0}, {emitEvent: false})),
      map(() => `query`),
    ),
    ...[`offset`, `per_page`].map((controlName: string) =>
      (this.form.get(controlName) as FormControl).valueChanges.pipe(
        delay(10),
        map(() => `filters`),
      )
    ),

    this.search$.pipe(
      map((): string => `search`),
    ),
  ).pipe(
    map((source: string) => {
      return [source, this.form.value]
    }),
    map(() => this.form.value),
    takeUntilDestroyed(),
    filter(() => this.form.valid),
    tap((_filters: Record<string, any>): void => {
      const filters: Record<string, any> = {..._filters};

      // Remove empty filters
      if (!(filters['query'] && typeof filters['query'] === `string` && filters['query'].length > 0)) delete filters['query'];

      this.search(filters);
    })
  ).subscribe(nue());

  ngOnInit(): void {
    this.search();
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.search());
  }

  formSubmit(): void {
    this.search();
  }

  delete(tagId: number | undefined): void {
    if (!(tagId)) return;

    this.notifications.confirm($localize`Sei sicuro di voler cancellare questo tag?`).subscribe({
      next: (confirmed: boolean): void => {
        if (confirmed) this.confirmedDelete(tagId);
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
        this.notifications.error(parseHttpErrorMessage(error) || $localize`Qualcosa è andato storto nella cancellazione.`);
      }
    })
  }

  private search(filters = this.form.value): void {
    this.loading.set(true);
    this.service.search(filters).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (result: SearchResult<Tag>) => {
        this.data.set(result);
      },
    });
  }

  paginationChange(event: TuiTablePagination) {
    this.form.patchValue({offset: event.page, per_page: event.size});
  }
}
