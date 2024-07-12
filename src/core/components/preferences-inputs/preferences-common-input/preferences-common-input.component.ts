import {
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges, OnInit,
  Output,
  signal,
  SimpleChanges, WritableSignal
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlOptions,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {map, Observable, takeUntil} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TuiSizeL, TuiSizeS} from "@taiga-ui/core";
import {PreferenceValue} from "@core/lib/preferences";
import {areDifferent} from "@core/lib/are-different";

/**
 * Generic class for common input components
 */
@Component({
  standalone: true,
  imports: [],
  template: ``,
  providers: [
    TuiDestroyService,

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreferencesCommonInputComponent),
      multi: true
    },
  ]
})
export class PreferencesCommonInputComponent<T> implements ControlValueAccessor, OnChanges, OnInit {
  static readonly inputs: string[] = ['mandatory', 'inputSize', 'placeholder'];
  static readonly outputs: string[] = ['submit', 'valueChange'];

  protected readonly destroy$ = inject(TuiDestroyService);

  /**
   * SET THEESE IN CHILD CLASS
   */
    // protected readonly formatInput: (value: unknown | null) => T = (value: unknown | null) => value as T;
    // protected readonly isValidT: (value: unknown) => value is T = (value: unknown): value is T => true;
  protected readonly defaultValue: T | null = null;
  protected controlValidators: ValidatorFn[] = [];

  @Input() mandatory: boolean = false;
  @Input() inputSize: TuiSizeS | TuiSizeL = 'm';
  @Input() placeholder: string = $localize`Seleziona...`;

  @Output() submit: EventEmitter<T | null> = new EventEmitter<T | null>();

  readonly control: FormControl<T | null> = new FormControl<T | null>(this.defaultValue, this.controlValidators);

  protected initialValue: T | null = this.defaultValue;

  readonly somethingChanged: WritableSignal<boolean> = signal(false);

  @Output() readonly valueChange = this.control.valueChanges.pipe(
    takeUntilDestroyed()
  )

  ngOnInit(): void {
    this.control.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (value: T | null): void => {
        const diff = areDifferent(value, this.initialValue);
        // console.log(`control value change`, {value, initial: this.initialValue, diff});

        if (diff) this.somethingChanged.set(true);
        else this.somethingChanged.set(false);
      }
    });
  }

  resetInitialValue(): void {
    this.control.patchValue(this.initialValue);
  }

  emitSubmit(): void {
    this.submit.emit(this.control.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mandatory']) this.updateValidators();
  }

  writeValue(value: any): void {
    value ||= null;
    // console.log(`writeValue`, value);
    this.initialValue = value;
    this.control.setValue(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.valueChange.subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.valueChange.subscribe(fn);
  }

  protected updateValidators(): void {
    let validators: ValidatorFn[] = this.controlValidators;
    if (this.mandatory) validators.push(Validators.required);

    this.control.setValidators(validators);
  }
}
