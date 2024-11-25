import {ChangeDetectionStrategy, Component, forwardRef, inject, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ReservationStatus, ReservationStatuses} from "@core/lib/interfaces/reservation-data";
import {distinctUntilChanged, filter, Observable, takeUntil} from "rxjs";
import {TuiDataListWrapperModule, TuiSelectModule} from "@taiga-ui/kit";
import {TuiDataListModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {NgForOf} from "@angular/common";
import { ReservationStatusComponent } from "../reservation-status/reservation-status.component";

@Component({
  selector: 'app-reservation-status-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiSelectModule,
    TuiDataListModule,
    NgForOf,
    TuiTextfieldControllerModule,
    ReservationStatusComponent
],
  templateUrl: './reservation-status-select.component.html',
  styleUrl: './reservation-status-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReservationStatusSelectComponent),
      multi: true
    },

    TuiDestroyService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationStatusSelectComponent implements OnInit, ControlValueAccessor {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  readonly control: FormControl<null | ReservationStatus> = new FormControl<null | ReservationStatus>(null);

  readonly statuses: ReservationStatus[] = [...ReservationStatuses];

  @Input() inputSize: 's' | 'm' | 'l' = 'm';

  private readonly valueChanges$: Observable<null | ReservationStatus> = this.control.valueChanges.pipe(
    takeUntil(this.destroy$),
    distinctUntilChanged(),
    filter(() => this.control.valid),
  );

  @Input() showCleaner: boolean = true;

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
    if (obj == null || typeof obj == 'string') return this.control.setValue(obj);

    console.warn(`Invalid value for reservation status select:`, obj);
  }
}
