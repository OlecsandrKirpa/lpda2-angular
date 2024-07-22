import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomValidators} from "@core/lib/custom-validators";
import {
  TuiCarouselModule, TuiCheckboxBlockModule,
  TuiInputModule, TuiInputNumberModule, tuiInputNumberOptionsProvider,
  TuiInputPhoneInternationalModule,
  TuiStepperModule,
  TuiTextareaModule
} from "@taiga-ui/kit";
import {TuiAutoFocusModule, TuiDestroyService, tuiPure} from "@taiga-ui/cdk";
import {
  PeopleCountInputComponent
} from "@core/components/public-reservation-form/people-count-input/people-count-input.component";
import {filter, takeUntil, tap} from "rxjs";
import {DatetimeInputComponent} from "@core/components/public-reservation-form/datetime-input/datetime-input.component";
import {isoTimezoneRexExp} from "@core/lib/tui-datetime-to-iso-string";
import {TuiButtonModule} from "@taiga-ui/core";
import {DatePipe} from "@angular/common";
import {TuiCountryIsoCode} from '@taiga-ui/i18n';
import {CreateReservationData, formatReservationData} from "@core/lib/interfaces/create-reservation-data";
import {PublicReservationsService} from "@core/services/http/public-reservations.service";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";
import {NotificationsService} from "@core/services/notifications.service";
import {Reservation} from "@core/models/reservation";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";

interface FormStep {
  form: FormGroup | AbstractControl;
  submitted: boolean;
  viewed: boolean;
}

@Component({
  selector: 'app-public-reservation-form',
  standalone: true,
  imports: [
    TuiStepperModule,
    PeopleCountInputComponent,
    ReactiveFormsModule,
    TuiCarouselModule,
    DatetimeInputComponent,
    TuiInputModule,
    TuiButtonModule,
    DatePipe,
    TuiAutoFocusModule,
    TuiInputPhoneInternationalModule,
    TuiTextareaModule,
    TuiInputNumberModule,
    TuiCheckboxBlockModule
  ],
  templateUrl: './public-reservation-form.component.html',
  styleUrl: './public-reservation-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
  ]
})
export class PublicReservationFormComponent implements OnInit {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly reservations: PublicReservationsService = inject(PublicReservationsService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  @Output() createdReservation: EventEmitter<Reservation> = new EventEmitter<Reservation>();

  readonly currentIndex: WritableSignal<number> = signal(0);

  readonly people: FormControl<number | null> = new FormControl(null, [Validators.required, CustomValidators.min(0)]);
  readonly datetime: FormControl<string | null> = new FormControl(null, [Validators.required, CustomValidators.pattern(isoTimezoneRexExp)]);

  readonly contacts: FormGroup = new FormGroup({
    firstName: new FormControl<string | null>(null, [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl<string | null>(null, [Validators.required, Validators.minLength(2)]),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    phone: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6)]),
  });

  readonly notesForm: FormGroup = new FormGroup({
    notes: new FormControl<string | null>(null),
    children: new FormControl(0, [Validators.required, CustomValidators.min(0)]),
    acceptTerms: new FormControl(false, [Validators.requiredTrue])
  });

  readonly countries: readonly TuiCountryIsoCode[] = Object.values(TuiCountryIsoCode);

  /**
   * TODO this field should be set depending on the user's headers AND the selected language for the website.
   */
  countryIsoCode = TuiCountryIsoCode.IT;

  readonly steps: { [index: number]: FormStep } = {
    0: {
      form: this.people,
      submitted: false,
      viewed: false
    },
    1: {
      form: this.datetime,
      submitted: false,
      viewed: false
    },
    2: {
      form: this.contacts,
      submitted: false,
      viewed: false
    },
    3: {
      form: this.notesForm,
      submitted: false,
      viewed: false
    }
  };

  ngOnInit(): void {
    /**
     * Listen to the people form changes and move to the next step.
     */
    this.people.valueChanges.pipe(
      takeUntil(this.destroy$),
      // tap((value: number | null) => console.log('people', {value, step: this.currentIndex()})),
      filter((value: unknown): value is number => typeof value === "number" && value > 0),
      filter(() => this.currentIndex() === 0)
    ).subscribe({
      next: () => {
        setTimeout(() => this.nextStep(), 10)
      }
    });

    this.datetime.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter((value: unknown) => this.datetime.valid),
      filter(() => this.currentIndex() === 1)
    ).subscribe({
      next: (): void => {
        setTimeout(() => this.nextStep(), 10)
      }
    });

    /**
     * DEVELOPMENT ONLY:
     */
    // setTimeout(() => {
    //   this.loadPrevious({
    //     adults: 2,
    //     children: 1,
    //     datetime: `2024-07-22T12:00:00.000Z`,
    //     firstName: `Sasha`,
    //     lastName: `Kirpachov`,
    //     email: `sasha@opinioni.net`,
    //     phone: `3515590063`,
    //     phoneCountry: `IT`
    //   });
    // }, 500);
  }

  nextStep(): void {
    // console.log(`nextStep()`, this.currentStep().form.invalid);
    this.currentStep().submitted = true;
    if (this.currentStep().form.invalid) return;

    if (this.steps[this.currentIndex() + 1]) {
      this.currentIndex.update((index) => index + 1);
      this.currentStep().viewed = true;
    } else {
      const out = this.formatOutput();
      console.log(`submitting!!!`, {out, self: this});

      if (out) this.reservations.create(out).subscribe({
        next: (item: Reservation): void => {
          this.createdReservation.emit(item);
          this.notifications.success($localize`La tua prenotazione è stata creata. A breve ti invieremo un'email di conferma.`);
          this.reset();
        },
        error: (error: unknown) => {
          if (error instanceof HttpErrorResponse) {
            this.notifications.error(parseHttpErrorMessage(error) || SOMETHING_WENT_WRONG_MESSAGE);
          } else {
            this.notifications.error(SOMETHING_WENT_WRONG_MESSAGE);
          }
        }
      })
      else this.notifications.error(SOMETHING_WENT_WRONG_MESSAGE);
    }
  }

  setState(number: number): void {
    this.currentIndex.set(number);
  }

  @tuiPure
  getState(forIndex: number): 'error' | 'normal' | 'pass' {
    const step: { form: FormGroup | AbstractControl } | undefined = this.steps[forIndex];
    if (!step) return 'normal';

    const form: FormGroup | AbstractControl | undefined = step.form;
    if (!form || (forIndex > this.currentIndex())) return "normal";

    if (form.invalid && form.dirty) return 'error';
    if (form.valid) return 'pass';
    return 'normal';
  }

  private currentStep(): FormStep {
    return this.steps[this.currentIndex()];
  }

  private loadPrevious(data: {
    adults?: number,
    children?: number,
    datetime?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
    phoneCountry?: string,
    notes?: string;

  }): void {
    let people = 0;
    if (data.adults) people += data.adults;
    if (data.children) people += data.children;

    this.people.setValue(people || null);

    if (data.datetime) {
      this.datetime.setValue(data.datetime);
    } else {
      this.datetime.setValue(null);
    }

    if (data.firstName) this.contacts.get('firstName')?.setValue(data.firstName);
    if (data.lastName) this.contacts.get('lastName')?.setValue(data.lastName);
    if (data.email) this.contacts.get('email')?.setValue(data.email);
    if (data.phone) this.contacts.get('phone')?.setValue(data.phone);
    if (data.phoneCountry) this.countryIsoCode = data.phoneCountry as TuiCountryIsoCode;
    if (data.notes) this.notesForm.patchValue({notes: data.notes});
    if (data.children) this.notesForm.patchValue({children: data.children});
  }

  private formatOutput(): CreateReservationData | null {
    const email: string | undefined = this.contacts.get('email')?.value;
    const phone: string | undefined = this.contacts.get('phone')?.value;
    const firstName: string | undefined = this.contacts.get('firstName')?.value;
    const lastName: string | undefined = this.contacts.get('lastName')?.value;
    const datetime: string | undefined | null = this.datetime.value;
    const children: number | undefined | null = this.notesForm.get(`children`)?.value;
    const people: number | undefined | null = this.people.value;
    const notes: string | null | undefined = this.notesForm.get(`notes`)?.value;

    // if (!(typeof email === "string" && email.length > 0)) return null;
    // if (!(typeof phone === "string" && phone.length > 0)) return null;
    // if (!(typeof firstName === "string" && firstName.length > 0)) return null;
    // if (!(typeof lastName === "string" && lastName.length > 0)) return null;
    // if (!(typeof datetime === "string" && datetime.length > 0)) return null;
    // if (!(typeof notes === "string" && notes.length > 0)) return null;
    //
    // if (!(typeof children === "number" && children >= 0)) return null;
    // if (!(typeof people === "number" && people > 0)) return null;

    return formatReservationData({
      email,
      phone,
      datetime,
      children,
      notes,
      adults: people && children ? people - children : null,
      firstName: firstName,
      lastName: lastName
    });
  }

  private reset(): void {
    this.currentIndex.set(0);
    Object.values(this.steps).forEach((key: { form: AbstractControl | FormGroup }) => key.form.reset());
  }
}
