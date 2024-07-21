import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
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
    // tuiInputNumberOptionsProvider({
    //   decimal: 'never',
    //   step: 1,
    //
    // }),
  ]
})
export class PublicReservationFormComponent implements OnInit {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  readonly currentIndex: WritableSignal<number> = signal(0);

  readonly people: FormControl<number | null> = new FormControl(null, [Validators.required, CustomValidators.min(0)]);
  readonly datetime: FormControl<string | null> = new FormControl(null, [Validators.required, CustomValidators.pattern(isoTimezoneRexExp)]);

  // readonly peopleForm: FormGroup = new FormGroup({people: this.people});

  // readonly datetimeForm: FormGroup = new FormGroup({datetime: this.datetime});

  // readonly summaryForm: FormGroup = new FormGroup({
  //   children: new FormControl(0, [Validators.required, CustomValidators.min(0)]),
  // });

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


  // readonly form: FormGroup = new FormGroup({
  //   /**
  //    * STEP 1: How many people and how many children.
  //    */
  //   adults: new FormControl(null, [Validators.required, CustomValidators.min(0)]),
  //   children: new FormControl(0, [Validators.required, CustomValidators.min(0)]),
  //
  //   /**
  //    * STEP 2: Date and time of the reservation (show available dates only).
  //    */
  //   date: new FormControl(null, [Validators.required]),
  //   time: new FormControl(null, [Validators.required]),
  //
  //   /**
  //    * STEP 4: Full name, email and phone number.
  //    */
  //   fullname: new FormControl(null, [Validators.required]),
  //   email: new FormControl(null, [Validators.required, Validators.email]),
  //   phone: new FormControl(null, [Validators.required]),
  //
  //   /**
  //    * STEP 5: (OPTIONAL, SEE CONFIGS) pay in advance.
  //    * paid will contain the amount paid in advance.
  //    */
  //   paid: new FormControl(null, [Validators.required, Validators.min(0)]),
  //
  //   /**
  //    * STEP 6: Additional notes.
  //    */
  //   notes: new FormControl(null)
  // });

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
      filter(() => this.currentIndex() === 0)
    ).subscribe({
      next: (): void => {
        setTimeout(() => this.nextStep(), 10)
      }
    });

    /**
     * DEVELOPMENT ONLY:
     */
    setTimeout(() => {
      this.loadPrevious({
        adults: 2,
        children: 1,
        datetime: `2024-07-22T12:00:00.000Z`,
        firstName: `Sasha`,
        lastName: `Kirpachov`,
        email: `sasha@opinioni.net`,
        phone: `3515590063`,
        phoneCountry: `IT`
      });
    }, 500);
  }

  nextStep(): void {
    // console.log(`nextStep()`, this.currentStep().form.invalid);
    this.currentStep().submitted = true;
    if (this.currentStep().form.invalid) return;

    if (this.steps[this.currentIndex() + 1]) {
      this.currentIndex.update((index) => index + 1);
      this.currentStep().viewed = true;
    } else {
      // TODO submit
      console.log(`TODO submit`, this);
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
    phoneCountry?: string
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
  }
}
