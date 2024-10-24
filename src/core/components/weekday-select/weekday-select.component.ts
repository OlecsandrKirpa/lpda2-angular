import { Component, Input, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAutoFocusModule, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDropdownModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { WeekdayPipe } from "../../pipes/weekday.pipe";

@Component({
  selector: 'app-weekday-select',
  standalone: true,
  imports: [
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
    ReactiveFormsModule,
    WeekdayPipe,
    TuiAutoFocusModule,
    TuiDropdownModule,
],
  templateUrl: './weekday-select.component.html',
  providers: [
    TuiDestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: WeekdaySelectComponent,
      multi: true
    }
  ]
})
export class WeekdaySelectComponent implements ControlValueAccessor {
  readonly control: FormControl<number | null> = new FormControl<number | null>(null, [Validators.min(0), Validators.max(6),]);

  // @Input() autofocus: boolean = false;
  readonly initialAutofocus: WritableSignal<boolean> = signal(false);
  readonly dropdownOpen: WritableSignal<boolean> = signal(false);

  @Input() showCleaner: boolean = true;

  @Input() set autofocus(v: boolean) {
    this.initialAutofocus.set(v === true);
    this.dropdownOpen.set(v === true);
  }

  ngOnChanges(): void {
    this.control.valueChanges.subscribe({
      next: (v: number | null) => {
        if (v) this.dropdownOpen.set(false);
      }
    });
  }

  writeValue(obj: unknown): void {
    let value: number | null = null;
    if (typeof obj === 'number') value = obj;
    else if (typeof obj === 'string') value = Number(obj);
    else value = null;

    this.control.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.subscribe({
      next: (v: number | null) => fn(v)
    });
  }

  registerOnTouched(fn: any): void {
    this.control.valueChanges.subscribe({
      next: (v: number | null) => fn(v)
    });
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.control.disable();
    else this.control.enable();
  }
}
