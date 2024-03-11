import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, computed,
  forwardRef,
  Input,
  OnDestroy,
  OnInit, Signal,
  signal, WritableSignal
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {BehaviorSubject, filter, Subject, takeUntil} from "rxjs";
import {TuiInputModule, TuiTextareaModule} from "@taiga-ui/kit";
import {NgClass, NgFor} from "@angular/common";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {LanguageNames} from "@core/lib/language-names";

@Component({
  selector: 'app-i18n-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    NgFor,
    ErrorsComponent,
    NgClass,
    TuiTextareaModule
  ],
  templateUrl: './i18n-input.component.html',
  styleUrl: './i18n-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => I18nInputComponent),
      multi: true
    },

    TuiDestroyService,
  ],
})
export class I18nInputComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  private readonly destroy$: TuiDestroyService = new TuiDestroyService();

  @Input() long: boolean = false;

  readonly controls: WritableSignal<Record<string, FormControl>> = signal({});

  readonly controlsArr: Signal<{lang: string, control: FormControl}[]> = computed(() => {
    const controls = this.controls();
    return Object.keys(controls).map((lang: string) => {
      return { lang, control: controls[lang] };
    })
  });

  private touched$ = new BehaviorSubject<boolean>(false);

  private value$: BehaviorSubject<Record<string, string|null>> = new BehaviorSubject<Record<string, string | null>>({});

  /**
   * Angular Callbacks
   */
  ngAfterViewInit(): void {
    this.addLang(`it`);
    this.addLang(`en`);
  }

  ngOnInit(): void {
  }

  registerOnChange(fn: any): void {
    this.value$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({next: (value) => fn(value)});
  }

  registerOnTouched(fn: any): void {
    this.touched$.pipe(
      filter((wasToched: boolean): boolean => wasToched === true),
    ).subscribe({next: () => fn()});
  }

  writeValue(obj: any): void {
    this.patchValue(obj ?? {});
    this.touched$.next(false);
  }

  /**
   * Public methods
   */
  wasTouched(): void {
    this.touched$.next(true);
  }

  getFullLang(lang: string): string {
    return LanguageNames[lang] ?? lang;
  }

  controlChanged(lang: string): void {
    this.value$.next({...this.value$.value, [lang]: this.controls()[lang].value});
  }

  /**
   * Private methods
   */
  private patchValue(value: Record<string, string | number | null | undefined>): void {
    Object.keys(this.controls()).forEach((controlName: string): void => {
      const control: FormControl = this.controls()[controlName];
      control.patchValue(value[controlName] ?? null);
    });
  }

  private addLang(lang: string): void {
    const control = new FormControl();
    control.valueChanges.subscribe({
      next: () => this.controlChanged(lang)
    });

    this.controls.set({...this.controls(), [lang]: control});
  }
}
