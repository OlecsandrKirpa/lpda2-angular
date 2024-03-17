import {Component, EventEmitter, Inject, inject, Input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {I18nInputComponent} from "@core/components/i18n-input/i18n-input.component";
import {TuiButtonModule, TuiDropdownModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {ImageInputComponent} from "@core/components/image-input/image-input.component";
import {Allergen} from "@core/models/allergen";
import {Reservation} from "@core/models/reservation";
import {
  tuiCreateTimePeriods,
  TuiInputDateModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputTimeModule
} from "@taiga-ui/kit";
import {TUI_IS_MOBILE, TuiAutoFocusModule, TuiDay, TuiDestroyService, TuiTime} from "@taiga-ui/cdk";
import {ReservationsService} from "@core/services/http/reservations.service";
import {filter, finalize, switchMap, takeUntil, takeWhile, tap} from "rxjs";
import {ReservationTurn} from "@core/models/reservation-turn";
import {nue} from "@core/lib/nue";
import {MatIcon} from "@angular/material/icon";
import {DatePipe} from "@angular/common";
import {strTimeTimezone} from "@core/lib/str-time-timezone";

/**
 * NEW and EDIT reservation's data
 */
@Component({
  selector: 'app-admin-reservation-form',
  standalone: true,
  imports: [
    ErrorsComponent,
    ReactiveFormsModule,
    I18nInputComponent,
    TuiButtonModule,
    ImageInputComponent,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiInputNumberModule,
    TuiInputDateTimeModule,
    TuiInputDateModule,
    TuiInputTimeModule,
    TuiAutoFocusModule,
    TuiDropdownModule,
    MatIcon,
    DatePipe,
  ],
  templateUrl: './admin-reservation-form.component.html',
  providers: [
    TuiDestroyService,
    DatePipe
  ]
})
export class AdminReservationFormComponent implements OnInit {
  private readonly reservationsService: ReservationsService = inject(ReservationsService);
  private readonly destroy$ = inject(TuiDestroyService);
  private readonly datePipe = inject(DatePipe);

  @Output() formSubmit: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();
  @Output() cancelled: EventEmitter<void> = new EventEmitter<void>();

  readonly validTimes: WritableSignal<readonly TuiTime[]> = signal<readonly TuiTime[]>([]);

  readonly today: TuiDay = TuiDay.currentLocal();

  readonly inputSize = 'l';

  @Input() set item(value: Reservation | null | undefined) {
    if (!(value)) {
      this.form.reset();
      return;
    }

    this.form.patchValue({
      date: value.datetime ? new TuiDay(value.datetime?.getFullYear(), value.datetime?.getMonth(), value.datetime?.getDate()) : null,
      time: value.datetime ? new TuiTime(value.datetime?.getHours(), value.datetime?.getMinutes()) : null,
      fullname: value.fullname,
      people: value.people,
      email: value.email,
      table: value.table,
      notes: value.notes,
      phone: value.phone,
    })
  }

  readonly form: FormGroup = new FormGroup({
    date: new FormControl<TuiDay | null>(null, [Validators.required]),
    time: new FormControl(null, [Validators.required]),
    fullname: new FormControl(null, [Validators.required]),
    people: new FormControl(null, [Validators.required, Validators.min(1)]),

    email: new FormControl(null, [Validators.email]),
    table: new FormControl(null),
    notes: new FormControl(null),
    phone: new FormControl(null),
  });

  @Input() loading: boolean = false;

  readonly dateOpen: WritableSignal<boolean> = signal(false);
  readonly timeOpen: WritableSignal<boolean> = signal(false);

  readonly loadingTimes: WritableSignal<boolean> = signal(false);

  private submitted: boolean = false;

  constructor(
    @Inject(TUI_IS_MOBILE) public readonly isMobile: boolean,
  ) {
  }

  ngOnInit(): void {
    this.dateOpen.set(true);
    this.timeOpen.set(false);

    this.form.get(`date`)!.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter((date: TuiDay | null): date is TuiDay => date instanceof TuiDay),
      tap(() => this.dateOpen.set(false)),
      tap(() => this.timeOpen.set(true)),
      tap(() => this.loadingTimes.set(true)),
      switchMap((date: TuiDay) => this.reservationsService.getValidTimes(date.toLocalNativeDate())),
      finalize(() => this.loadingTimes.set(false)),
    ).subscribe({
      next: (turns: ReservationTurn[]) => {
        const times: string[] = turns.map((turn: ReservationTurn) => turn.valid_times).filter((times: string[] | undefined): times is string[] => Array.isArray(times) && times.length > 0).flat();
        this.validTimes.set(times.map((time: string) => TuiTime.fromString(strTimeTimezone(time))));
      }
    });

    this.form.get(`time`)!.valueChanges.pipe(
      takeUntil(this.destroy$),
      tap(() => this.timeOpen.set(false)),
    ).subscribe(nue());
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.formSubmit.emit(this.formVal());
  }

  private formVal(): Record<string, any> {
    const json = this.form.value;

    /**
     * Here we have an issue.
     * User's browser timezone will be probably different from server's timezone.
     * So we need to convert in UTC before sending to server.
     *
     * new Date(...) will create a date in user's timezone.
     *
     */
    const currentTimezoneDate = new Date(`${(json.date as TuiDay).formattedYear}-${(json.date as TuiDay).formattedMonthPart}-${(json.date as TuiDay).formattedDayPart} ${(json.time as TuiTime).toString()}`);
    json.datetime = currentTimezoneDate.toISOString();
    // json.datetime = new Date(str);
    delete json.date;
    delete json.time;

    if (!(json.table && json.table.length > 0)) delete json.table;
    if (!(json.notes && json.notes.length > 0)) delete json.notes;
    if (!(json.email && json.email.length > 0)) delete json.notes;

    return json;
  }

  e = this.errorsFor;

  private errorsFor(controlName: string): ValidationErrors | null {
    const control = this.form.get(controlName);
    if (!(control)) return null;

    if (control.dirty || control.touched || this.submitted) {
      return control.errors;
    }

    return null;
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
