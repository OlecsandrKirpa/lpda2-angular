import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal, ViewChild,
  WritableSignal
} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiAutoFocusModule, TuiDay, TuiDestroyService} from "@taiga-ui/cdk";
import {TuiButtonModule, TuiHintModule, TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {RouterLink, RouterOutlet} from "@angular/router";
import {ShowImageComponent} from "@core/components/show-image/show-image.component";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {SearchResult} from "@core/lib/search-result.model";
import {NotificationsService} from "@core/services/notifications.service";
import {
  debounceTime,
  delay,
  filter,
  finalize,
  map,
  merge,
  Observable,
  Subject,
  Subscription,
  takeUntil,
  tap
} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {nue} from "@core/lib/nue";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {Reservation} from "@core/models/reservation";
import {ReservationsService} from "@core/services/http/reservations.service";
import {
  ReservationStatusSelectComponent
} from "@core/components/reservation-status-select/reservation-status-select.component";

import {
  ReservationDateSelectComponent
} from "@core/components/reservation-date-select/reservation-date-select.component";
import {ReservationTurn} from "@core/models/reservation-turn";
import {
  ReservationTurnSelectComponent
} from "@core/components/dynamic-selects/reservation-turn-select/reservation-turn-select.component";

@Component({
  selector: 'app-admin-reservations-home',
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
    TuiHintModule,
    ReservationStatusSelectComponent,
    ReservationTurnSelectComponent,
    ReservationDateSelectComponent,
  ],
  templateUrl: './admin-reservations-home.component.html',
  providers: [
    TuiDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReservationsHomeComponent implements OnInit {
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly data: WritableSignal<SearchResult<Reservation> | null> = signal(null);
  readonly items: Signal<Reservation[]> = computed(() => this.data()?.items || []);
  private readonly service: ReservationsService = inject(ReservationsService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly date = inject(DatePipe);

  readonly form: FormGroup = new FormGroup({
    query: new FormControl(``),
    turn: new FormControl(null),
    date: new FormControl<Date | null>(new Date()),
    status: new FormControl('active'),
    offset: new FormControl(0, [Validators.min(0), Validators.required]),
    per_page: new FormControl(10, [Validators.min(1), Validators.required]),
  });

  readonly dateStr: WritableSignal<string | null> = signal(this.transformDate(new Date()));

  @ViewChild(ReservationTurnSelectComponent, {static: true}) turnSelect?: ReservationTurnSelectComponent;

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
        // tap((value: any) => console.log(`filter ${controlName} changed`, {value, formValue: this.form.value})),
        map(() => `filters`),
      )
    ),

    ...[`turn`, `status`].map((controlName: string) =>
      (this.form.get(controlName) as FormControl).valueChanges.pipe(
        delay(10),
        tap(() => this.form.patchValue({offset: 0}, {emitEvent: false})),
        map(() => `filters`),
      )
    ),

    this.form.get(`date`)!.valueChanges.pipe(
      delay(10),
      tap(() => this.form.patchValue({offset: 0, turn: null}, {emitEvent: false})),
      map(() => `dateFilter`)
    ),

    this.search$.pipe(
      map((): string => `search`),
    ),
  ).pipe(
    // map((source: string) => {
    //   return [source, this.form.value]
    // }),
    filter(() => this.form.valid),
    map(() => this.form.value),
    takeUntilDestroyed(),
    tap((_filters: Record<string, any>): void => {
      const filters: Record<string, any> = {..._filters};

      // Remove empty filters
      if (!(filters['query'] && typeof filters['query'] === `string` && filters['query'].length > 0)) delete filters['query'];


      if (filters['turn'] instanceof ReservationTurn && filters['date'] instanceof Date) {
        const date = this.transformDate(filters['date']);

        filters['datetime_from'] = `${date} ${(filters['turn'] as ReservationTurn).starts_at}`;
        filters['datetime_to'] = `${date} ${(filters['turn'] as ReservationTurn).ends_at}`;

        delete filters['turn']
        delete filters['date'];
      } else {
        if (filters['date'] instanceof Date) filters['date'] = this.transformDate(filters['date']);
        else delete filters['date'];
      }

      this.dateStr.set(filters['date']);

      if (!(filters['status'] && filters['status'].length > 0)) delete filters['status'];

      delete filters['turn'];

      this.search(filters);
    })
  ).subscribe(nue());

  readonly inputSize: "s" | "m" | "l" = 'm';

  ngOnInit(): void {
    this.search();
  }

  formSubmit(): void {
    this.search();
  }

  delete(reservationId: number | undefined): void {
    if (!(reservationId)) return;

    this.notifications.confirm($localize`Sei sicuro di voler cancellare questa prenotazione?`).subscribe({
      next: (confirmed: boolean): void => {
        if (confirmed) this.confirmedDelete(reservationId);
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
      next: (result: SearchResult<Reservation>) => {
        this.data.set(result);
      },
    });
  }

  paginationChange(event: TuiTablePagination) {
    this.form.patchValue({offset: event.page, per_page: event.size});
  }

  private transformDate(date: Date | null): string | null {
    if (date == null) return null;

    return this.date.transform(date, 'YYYY-MM-dd');
  }
}
