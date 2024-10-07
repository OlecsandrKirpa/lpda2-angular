import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  inject, Input,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
import {TuiBooleanHandler, TuiDay, TuiDestroyService, TuiTime} from "@taiga-ui/cdk";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators} from "@angular/forms";
import {TuiButtonModule, TuiCalendarModule, TuiExpandModule, TuiLoaderModule} from "@taiga-ui/core";
import {filter, finalize, merge, switchMap, take, takeUntil, tap} from "rxjs";
import {isoStringToTuiDay, isoStringToTuiTime, tuiDatetimeToIsoString} from "@core/lib/tui-datetime-to-iso-string";
import {ReservationTurn} from "@core/models/reservation-turn";
import {strTimeTimezone} from "@core/lib/str-time-timezone";
import {DatePipe, NgClass} from "@angular/common";
import {ReservationsService} from "@core/services/http/reservations.service";
import {MatIcon} from "@angular/material/icon";
import {NotificationsService} from "@core/services/notifications.service";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";
import {PublicReservationsService} from "@core/services/http/public-reservations.service";

/**
 * TODO 21 luglio 2024:
 * In un primo momento, non escludere i giorni. Mancano le tabelle e gli endpoint per scaricare le informazioni.
 *
 * Da qui mancano due endpoint pubblici:
 * - Uno scaricherà quali sono i giorni di ferie ed i giorni (settimanali) di chiusura del locale.
 * - Uno scaricherà quali sono i turni (orari) disponibili per ciascun giorno (scarica informazione solo quando si seleziona un giorno).
 *
 * In questo modo siamo in grado di:
 * - Disattivare i giorni di ferie e di chiusura settimanale, non rendendo possibile la loro selezione nei calendari.
 * - Mostrare solo gli orari disponibili per ciascun giorno.
 *
 * Lato server la cosa da fare è:
 * - Generare tutti i possibili turni per ciascun giorno dal momento attuale fino a {{x}} giorni avanti (in base alle configurazioni)
 * - Da questi elementi generati, escludere quelli che rientrano in giorni di ferie o chiusure programmate.
 * Da qui, si ritorni l'informazione dei giorni con almeno un turno per il primo endpoint e l'informazione dei turni per ciascun giorno per il secondo endpoint.
 */

@Component({
  selector: 'app-datetime-input',
  standalone: true,
  imports: [
    TuiExpandModule,
    TuiCalendarModule,
    TuiButtonModule,
    NgClass,
    DatePipe,
    MatIcon,
    TuiLoaderModule
  ],
  templateUrl: './datetime-input.component.html',
  styleUrl: './datetime-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DatetimeInputComponent,
      multi: true
    }
  ]
})
export class DatetimeInputComponent implements OnInit, ControlValueAccessor {
  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly reservationsService: PublicReservationsService = inject(PublicReservationsService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly destroy$ = inject(TuiDestroyService);

  @Output() readonly valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() readonly inputTouch: EventEmitter<void> = new EventEmitter<void>();
  private lastEmitted: string | null = null;

  readonly date: FormControl<TuiDay | null> = new FormControl(null, [Validators.required]);
  readonly time: FormControl<TuiTime | null> = new FormControl(null, [Validators.required]);

  readonly validTimes: WritableSignal<readonly TuiTime[]> = signal<readonly TuiTime[]>([]);
  readonly loadingTimes: WritableSignal<boolean> = signal(false);

  readonly today: WritableSignal<TuiDay> = signal(TuiDay.currentLocal());

  readonly disabledDates: TuiBooleanHandler<TuiDay> = (day: TuiDay): boolean => {
    if (day.dayBefore(this.today())) return true;
    if (day.dayAfter(this.today().append({day: this.maxDaysInAdvance}))) return true;

    return false;
  };

  @Input() maxDaysInAdvance: number = 300;

  ngOnInit(): void {
    merge(this.date.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter(() => this.date.valid)
    ), this.time.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter(() => this.time.valid)
    ),).subscribe({
      next: (): void => {
        this.touched();
        const date: TuiDay | null = this.date.value;
        const time: TuiTime | null = this.time.value;
        if (date && time) {
          this.emit(tuiDatetimeToIsoString(date, time));
        }
      }
    });

    this.date.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter((date: TuiDay | null): date is TuiDay => date instanceof TuiDay),
      tap(() => this.loadingTimes.set(true)),
      switchMap((date: TuiDay) => this.reservationsService.getValidTimes(date).pipe(
        finalize(() => this.loadingTimes.set(false)),
      ))
    ).subscribe({
      next: (turns: ReservationTurn[]) => {
        const times: string[] = turns.map((turn: ReservationTurn) => turn.valid_times).filter((times: string[] | undefined): times is string[] => Array.isArray(times) && times.length > 0).flat();
        this.validTimes.set(times.map((time: string) => TuiTime.fromString(strTimeTimezone(time))));
      },
      error: (error: unknown): void => {
        this.notifications.error(error instanceof HttpErrorResponse ? parseHttpErrorMessage(error) : SOMETHING_WENT_WRONG_MESSAGE);
      }
    });
  }

  writeValue(obj: unknown): void {
    if (obj === null || obj === undefined) {
      this.date.reset();
      this.time.reset();

      return;
    }

    if (typeof obj === "string") {
      this.date.setValue(isoStringToTuiDay(obj));
      this.time.setValue(isoStringToTuiTime(obj));
      setTimeout(() => this.cd.detectChanges());
      return;
    }

    console.warn(`Invalid parameter provided to writeValue`, {obj});
    // console.warn(`TODO: implement writeValue`, obj);
  }

  registerOnChange(fn: any): void {
    this.valueChanged.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.inputTouch.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.date.disable();
      this.time.disable();
    } else {
      this.date.enable();
      this.time.enable();
    }
  }

  onDayClick(day: TuiDay): void {
    this.date.setValue(day);
  }

  touched(): void {
    this.inputTouch.emit();
  }

  private emit(s: string): void {
    // if (this.lastEmitted === s) return;

    this.lastEmitted = s;
    this.valueChanged.emit(s);
  }

  onTimeClick(time: TuiTime) {
    this.time.setValue(time);
  }
}
