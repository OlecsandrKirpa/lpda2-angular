import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges, ViewChild, WritableSignal } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { HolidayData } from '@core/lib/interfaces/holiday-data';
import { Holiday } from '@core/models/holiday';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';
import { filter, takeUntil } from 'rxjs';
import { WeeklyHolidayFormComponent } from './weekly-holiday-form/weekly-holiday-form.component';
import { OnceHolidayFormComponent } from './once-holiday-form/once-holiday-form.component';

@Component({
  selector: 'app-holiday-form',
  standalone: true,
  imports: [
    TuiButtonModule,
    WeeklyHolidayFormComponent,
    OnceHolidayFormComponent,
    FormsModule,
    JsonPipe,
  ],
  templateUrl: './holiday-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
  ],
})
export class HolidayFormComponent {

  readonly weekly: WritableSignal<boolean | null> = signal(null);

  @Output() cancelEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitEvent: EventEmitter<Record<string, unknown>> = new EventEmitter<Record<string, unknown>>();

  // @Input() holiday: WritableSignal<Holiday | null> = signal(null);

  private holidayValue: Holiday | null = null;
  @Input() set holiday(value: Holiday | null) {
    this.holidayValue = value;
    this.updateWeeklyByHoliday();
  }

  get holiday(): Holiday | null {
    return this.holidayValue;
  }

  @ViewChild(WeeklyHolidayFormComponent) weeklyHolidayForm: WeeklyHolidayFormComponent | null = null;
  @ViewChild(OnceHolidayFormComponent) onceHolidayForm: OnceHolidayFormComponent | null = null;

  // ngOnInit(): void {
  //   this.updateWeeklyByHoliday();
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes["holiday"]) {
  //     this.updateWeeklyByHoliday();
  //   }
  // }

  findForm(): FormGroup {
    const component = this.weekly() ? this.weeklyHolidayForm : this.onceHolidayForm;
    if (!component) throw new Error('Component not found');
    if (!component.form) throw new Error('Form not found');
    return component.form;
  }

  private updateWeeklyByHoliday(): void {
    const h = this.holiday;
    if (h) this.weekly.set(h.isWeekly === true)
    else this.weekly.set(null);
  }
}
