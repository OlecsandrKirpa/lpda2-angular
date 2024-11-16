import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { ReactiveErrors } from '@core/lib/reactive-errors/reactive-errors';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { ReservationTurn } from '@core/models/reservation-turn';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiAutoFocusModule, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiExpandModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiInputModule, TuiInputNumberModule, TuiInputTimeModule, TuiSelectModule } from '@taiga-ui/kit';
import { distinctUntilChanged, finalize, takeUntil, tap } from 'rxjs';
import { ErrorsComponent } from "../errors/errors.component";
import { WeekdaySelectComponent } from '../weekday-select/weekday-select.component';
import { ReservationTurnsService } from '@core/services/http/reservation-turns.service';
import { SearchResult } from '@core/lib/search-result.model';
import { WeekdayPipe } from "../../pipes/weekday.pipe";
import { DowncasePipe } from "../../pipes/downcase.pipe";
import { tuiTimeToUTCString } from '@core/lib/tui-datetime-to-iso-string';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-reservation-turn-form',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiLoaderModule,
    ReactiveFormsModule,
    TuiInputModule,
    ErrorsComponent,
    TuiInputNumberModule,
    TuiInputTimeModule,
    WeekdaySelectComponent,
    TuiAutoFocusModule,
    WeekdayPipe,
    TuiExpandModule,
    DowncasePipe,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
],
  templateUrl: './reservation-turn-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationTurnFormComponent implements OnInit {
  private readonly service = inject(ReservationTurnsService);
  private readonly destroy$ = inject(TuiDestroyService);
  private readonly notifications = inject(NotificationsService);
  private readonly route = inject(ActivatedRoute);

  readonly formSubmitted: WritableSignal<boolean> = signal<boolean>(false);

  private readonly parentLoading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly searching: WritableSignal<boolean> = signal<boolean>(false);

  readonly loading = computed(() => this.parentLoading() || this.searching());

  @Input({alias: `loading`}) set setParentLoading(value: boolean) {
    this.parentLoading.set(value);
  }

  private _context: "update" | "create" = "create";
  @Input({required: true}) set context(context: "update" | "create"){
    if (context == "update") {
      this.form.controls.weekday.disable();
    } else {
      this.form.controls.weekday.enable();
    }
  }

  get context(){
    return this._context;
  }

  @Output() submitted: EventEmitter<Record<string, unknown>> = new EventEmitter();
  @Output() cancelled: EventEmitter<void> = new EventEmitter<void>();

  private readonly concurrentData: WritableSignal<SearchResult<ReservationTurn> | null> = signal<SearchResult<ReservationTurn> | null>(null);
  readonly concurrent = computed(() => (this.concurrentData()?.items ?? []).filter((i: ReservationTurn) => i.weekday == this.form.value.weekday && i.id != this.currentItemId()));

  readonly form = new FormGroup<{
    weekday: AbstractControl<number | null>,
    starts_at: AbstractControl<TuiTime | null>,
    ends_at: AbstractControl<TuiTime | null>,
    step: AbstractControl<number | null>,
    name: AbstractControl<string | null>,
  }>({
    weekday: new FormControl<number | null>(null, [Validators.required]),
    starts_at: new FormControl<TuiTime | null>(null, [Validators.required]),
    ends_at: new FormControl<TuiTime | null>(null, [Validators.required]),
    step: new FormControl<number | null>(30, [Validators.required, Validators.min(15), Validators.max(60)]),
    name: new FormControl<string | null>(null, [Validators.required]),
  });

  private readonly formInitialValue = this.form.value;

  private currentItemId: WritableSignal<number | null> = signal<number | null>(null);

  @Input() set turn(item: ReservationTurn | null) {
    this.currentItemId.set(item?.id ?? null);

    if (!item) {
      this.form.reset(this.formInitialValue);
    } else {
      const value = {
        weekday: item.weekday,
        starts_at: item.starts_at ? TuiTime.fromString(item.starts_at) : null,
        ends_at: item.ends_at ? TuiTime.fromString(item.ends_at) : null,
        step: item.step,
        name: item.name,
      };

      this.form.patchValue(value)
    }
  }

  ngOnInit(): void {
    this.form.controls.weekday.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
    ).subscribe({next: (v: number | null) => this.searchSameWeekday(v)});

    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe({next: (p: Params) => {
      if (p["weekday"]) {
        this.form.controls.weekday.setValue(p["weekday"]);

        // this.searchSameWeekday(p["weekday"]);
      }
    }})
  }

  manageHttpError(error: HttpErrorResponse): void {
    ReactiveErrors.assignErrorsToForm(this.form, error);
    this.notifications.error(parseHttpErrorMessage(error) || SOMETHING_WENT_WRONG_MESSAGE);
  }

  submit(): void {
    this.formSubmitted.set(true);

    if (this.form.invalid) return;

    this.submitted.emit(this.formatOutput());
  }

  cancel(): void {
    this.cancelled.emit();
  }

  private formatOutput(): Record<string, unknown> {
    const { ends_at, starts_at, name, step } = this.form.value;

    const data: Record<string, unknown> = {
      starts_at: starts_at ? tuiTimeToUTCString(starts_at) : null,
      ends_at: ends_at ? tuiTimeToUTCString(ends_at) : null,
      name: name ?? '',
      step: step ?? 30,
    }

    if (this.context == "create") data["weekday"] = this.form.controls.weekday.value || 0;

    return data;
  }

  private searchSameWeekday(weekday: number | null): void {
    if (weekday == null) {
      this.concurrentData.set(null);
      return;
    }

    this.searching.set(true);
    this.service.search({ weekday: weekday, per_page: 100 }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.searching.set(false))
    ).subscribe({
      next: (v: SearchResult<ReservationTurn>) => this.concurrentData.set(v)
    })
  }
}
