import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '@core/lib/custom-validators';
import { HolidayData } from '@core/lib/interfaces/holiday-data';
import { isoStringToTuiDay } from '@core/lib/tui-datetime-to-iso-string';
import { Holiday } from '@core/models/holiday';
import { TuiAutoFocusModule, TuiDay, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { from } from 'rxjs';
import { ErrorsComponent } from "../../errors/errors.component";
import { TuiButtonModule, TuiDropdownModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {TuiInputDateRangeModule} from '@taiga-ui/kit';
import { JsonPipe } from '@angular/common';
import { I18nInputComponent } from '@core/components/i18n-input/i18n-input.component';


type HolidayOutputFormat = {
  from_timestamp: string;
  to_timestamp: string;
  message: Record<string, string> | null;
}

@Component({
  selector: 'app-once-holiday-form',
  standalone: true,
  imports: [
    ErrorsComponent,
    TuiButtonModule,
    ReactiveFormsModule,
    TuiInputDateRangeModule,
    JsonPipe,
    TuiAutoFocusModule,
    TuiTextfieldControllerModule,
    TuiDropdownModule,
    I18nInputComponent,
  ],
  templateUrl: './once-holiday-form.component.html',
  providers: [
    TuiDestroyService,
  ]
})
export class OnceHolidayFormComponent {

  readonly today: TuiDay = TuiDay.currentLocal();

  @Output() submitEvent = new EventEmitter<HolidayOutputFormat>();
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter<void>();

  readonly dates: FormControl<{from: TuiDay, to: TuiDay} | null> = new FormControl<{from: TuiDay, to: TuiDay} | null>(null, [Validators.required]);
  readonly message: FormControl<Record<string, string> | null> = new FormControl<Record<string, string> | null>(null, [
    Validators.required,
    CustomValidators.objectNotEmpty
  ]);

  readonly submitted: WritableSignal<boolean> = signal(false);

  readonly form: FormGroup = new FormGroup({
    dates: this.dates,
    message: this.message,
  });

  protected readonly formDefaultValue = this.form.value;

  submit() {
    this.submitted.set(true);
    if (this.form.invalid) return;

    const v = this.formatOutput();
    if (!v) return console.warn(`Invalid form value`, this.form.value);

    this.submitEvent.emit(v);
  }

  cancel() {
    this.cancelEvent.emit();
  }

  @Input() set holiday(obj: Holiday | HolidayData | null) {
    const data: HolidayData | null | undefined = obj instanceof Holiday ? obj.data : obj;
    if (data) {
      const newFormVal: Record<string, unknown> = {};
      const fromTimestamp = data.from_timestamp ? isoStringToTuiDay(data.from_timestamp) : null;
      const toTimestamp = data.to_timestamp ? isoStringToTuiDay(data.to_timestamp) : null;

      if (fromTimestamp && toTimestamp) {
        newFormVal["dates"] = { from: fromTimestamp, to: toTimestamp };
      }

      this.form.patchValue(newFormVal);
    }
    else {
      this.form.reset(this.formDefaultValue);
    }
  }

  protected formatOutput(): HolidayOutputFormat | null {
    if (this.form.invalid) return null;

    const v = this.form.value;
    if (!v) return null;
    const dates = v["dates"];
    if (!dates) return null;

    const fromTimestamp: TuiDay | null | undefined = dates.from;
    const toTimestamp: TuiDay | null | undefined = dates.to;

    if (!fromTimestamp || !toTimestamp) return null;

    if (!(fromTimestamp instanceof TuiDay) || !(toTimestamp instanceof TuiDay)) throw new Error('Invalid TuiDay object');

    const from_timestamp = fromTimestamp.toString(`YMD`);
    const to_timestamp = toTimestamp.toString(`YMD`);

    const message = v["message"];

    return { from_timestamp, to_timestamp, message };
  }

}
