import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, OnInit, Output, Input, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { ReservationTurnFormComponent } from "@core/components/reservation-turn-form/reservation-turn-form.component";
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { ReservationTurnsService } from '@core/services/http/reservation-turns.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil, finalize, map, switchMap, filter, tap } from 'rxjs';
import { ReservationTurn } from '@core/models/reservation-turn';
import { Title } from '@angular/platform-browser';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { ReservationTurnMessage } from '@core/models/reservation-turn-message';
import { I18nInputComponent } from "@core/components/i18n-input/i18n-input.component";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { WeekdayPipe } from "@core/pipes/weekday.pipe";
import { DowncasePipe } from "@core/pipes/downcase.pipe";
import { CapitalizePipe } from "@core/pipes/capitalize.pipe";
import { TuiDay } from '@taiga-ui/cdk';
import { stringToTuiDay } from '@core/lib/tui-datetime-to-iso-string';
import { TuiInputDateModule } from '@taiga-ui/kit';
import { ErrorsComponent } from "@core/components/errors/errors.component";
import { ReservationTurnMessageData } from '@core/lib/interfaces/reservation-turn-message-data';
import { SelectTurnsPaymentv2Component } from "../select-turns-paymentv2/select-turns-paymentv2.component";
import { SelectTurnsComponent } from "../select-turns/select-turns.component";
import { JsonPipe } from '@angular/common';

interface Message {
  translations: Record<string, string>;
  from_date: TuiDay | null;
  to_date: TuiDay | null;
  turns: ReservationTurn[]
}

interface fg {
  from_date: FormControl<TuiDay | null>;
  to_date: FormControl<TuiDay | null>;
  message: FormControl<null | Record<string, string>>;
  turns: FormControl<null | ReservationTurn[]>
}

@Component({
  selector: 'app-reservation-turn-message-form',
  standalone: true,
  imports: [
    TuiLoaderModule,
    I18nInputComponent,
    FormsModule,
    MatIconModule,
    TuiButtonModule,
    ReactiveFormsModule,
    WeekdayPipe,
    DowncasePipe,
    CapitalizePipe,
    TuiInputDateModule,
    ErrorsComponent,
    SelectTurnsPaymentv2Component,
    SelectTurnsComponent,
    JsonPipe,
],
  templateUrl: './reservation-turn-message-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class ReservationTurnMessageFormComponent {

  private readonly notifications = inject(NotificationsService);

  @Output() onSubmit = new EventEmitter<Message>();

  @Output() onCancel = new EventEmitter<Message>();

  @Input() loading: boolean = false;

  @Input() set data(data: ReservationTurnMessage | null | undefined) {
    if (data == null || data == undefined) {
      this.form.reset();
      return;
    }

    this.form.patchValue({
      from_date: typeof data.from_date === 'string' ? stringToTuiDay(data.from_date) : data.from_date,
      to_date: typeof data.to_date === 'string' ? stringToTuiDay(data.to_date) : data.to_date,
      message: (data.translations?.message || {}),
      turns: data.turns,
    });
  }

  readonly submitted: WritableSignal<boolean> = signal(false);

  readonly form = new FormGroup<fg>({
    from_date: new FormControl<TuiDay | null>(null),
    to_date: new FormControl<TuiDay | null>(null),
    message: new FormControl<null | Record<string, string>>(null),
    turns: new FormControl<null | ReservationTurn[]>([]),
  });

  submitForm(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.onSubmit.emit(this.formatOutput())
  }

  cancelForm(): void {
    this.onCancel.emit();
  }

  private formatOutput(): Message {
    if (this.form.invalid) throw new Error('Form is invalid');

    return {
      from_date: this.form.value.from_date || null,
      to_date: this.form.value.to_date || null,
      translations: this.form.value.message || {},
      turns: this.form.value.turns ?? []
    }
  }
}
