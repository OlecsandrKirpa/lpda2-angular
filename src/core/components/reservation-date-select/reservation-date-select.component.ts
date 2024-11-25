import {ChangeDetectionStrategy, Component, forwardRef, inject, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TuiAutoFocusModule, TuiDay, TuiDestroyService} from "@taiga-ui/cdk";
import {ReservationStatus, ReservationStatuses} from "@core/lib/interfaces/reservation-data";
import {distinctUntilChanged, filter, map, Observable, takeUntil} from "rxjs";
import {TuiButtonModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {TuiInputDateModule} from "@taiga-ui/kit";

@Component({
  selector: 'app-reservation-date-select',
  standalone: true,
  imports: [
    TuiButtonModule,
    MatIcon,
    TuiInputDateModule,
    TuiAutoFocusModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reservation-date-select.component.html',
  styleUrl: './reservation-date-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReservationDateSelectComponent),
      multi: true
    },

    TuiDestroyService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationDateSelectComponent implements OnInit, ControlValueAccessor {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  readonly control: FormControl<null | TuiDay> = new FormControl<null | TuiDay>(null);

  @Input() inputSize: 's' | 'm' | 'l' = 'm';

  @Input() minToday: boolean = true;

  private readonly valueChanges$: Observable<null | Date> = this.control.valueChanges.pipe(
    takeUntil(this.destroy$),
    distinctUntilChanged(),
    filter(() => this.control.valid),
    map((value: TuiDay | null) => value ? value.toLocalNativeDate() : null)
  );

  readonly today: TuiDay = TuiDay.currentLocal();

  ngOnInit(): void {}

  registerOnChange(fn: any): void {
    this.valueChanges$.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.valueChanges$.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.control.disable();
    else this.control.enable();
  }

  writeValue(obj: any): void {
    this.control.patchValue(this.formatToTuiDay(obj));
  }

  prevDay(): void {
    if (!(this.control.value instanceof TuiDay)) {
      console.warn(`control value invalid`, this.control.value);
      return;
    }

    this.control.setValue(this.control.value.append({day: -1}));
  }

  nextDay(): void {
    if (!(this.control.value instanceof TuiDay)) {
      console.warn(`control value invalid`, this.control.value);
      return;
    }

    this.control.setValue(this.control.value.append({day: 1}));
  }

  private formatToTuiDay(obj: unknown): TuiDay | null {
    if (obj === null || obj instanceof TuiDay) return obj;

    if (obj instanceof Date) return TuiDay.fromLocalNativeDate(obj);

    if (typeof obj == 'string') return TuiDay.fromLocalNativeDate(new Date(obj));

    console.warn(`Invalid value for reservation date select:`, obj);
    return null;
  }
}
