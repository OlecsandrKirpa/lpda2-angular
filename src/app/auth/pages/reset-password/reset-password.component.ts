import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {ErrorsComponent} from '@core/components/errors/errors.component';
import {TuiAutoFocusModule, TuiDestroyService} from '@taiga-ui/cdk';
import {TuiButtonModule, TuiLoaderModule, TuiTextfieldControllerModule} from '@taiga-ui/core';
import {TuiInputModule, TuiInputPasswordModule} from '@taiga-ui/kit';
import {nue} from '@core/lib/nue';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ConfigsService} from '@core/services/configs.service';
import {ValidationError} from 'joi';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {tap, debounceTime, takeUntil} from 'rxjs';
import {AuthService} from "@core/services/http/auth.service";
import {NotificationsService} from "@core/services/notifications.service";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiInputModule,
    ErrorsComponent,
    TuiAutoFocusModule,
    TuiLoaderModule,
    TuiInputPasswordModule,
    TuiTextfieldControllerModule,
    TuiLoaderModule,
    RouterModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [
    TuiDestroyService
  ]
})
export class ResetPasswordComponent {
  private readonly auth: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly configs: ConfigsService = inject(ConfigsService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly form: FormGroup = new FormGroup({
    code: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  private readonly destroy$ = inject(TuiDestroyService);
  loading: boolean = false;

  typing: boolean = false;
  private readonly type$ = this.form.valueChanges.pipe(
    takeUntilDestroyed(),
    tap(() => this.typing = true),
    debounceTime(1000),
    tap(() => this.typing = false),
  ).subscribe();

  submitted: boolean = false;

  se(controlName: string): boolean {
    if (this.typing || !(this.submitted)) return false;

    const control = this.form.get(controlName);
    if (!(control)) return false;

    return control.invalid && (control.dirty || control.touched);
  }

  e(controlName: string): ValidationErrors | null {
    const control = this.form.get(controlName);
    if (!(control)) return null;

    return control.errors;
  }

  ngOnInit(): void {
    this.setMinPasswordLength();
    this.readCodeFromRoute();
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    this.auth.resetPassword(this.formValue()).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (): void => {
        this.loading = false;
        this.router.navigate(['/auth']);
        this.notifications.success($localize`La password è stata reimpostata con successo. Ora puoi effettuare il login.`);
      }, error: (e: HttpErrorResponse): void => {
        this.loading = false;
        this.notifications.error(parseHttpErrorMessage(e) || SOMETHING_WENT_WRONG_MESSAGE);
        console.error(`resetPassword`, e);
        this.form.setErrors({...this.form.errors, ...{server: e.error.message}})
      }
    });
  }

  private formValue(): { code: string, password: string } {
    const fv = this.form.value;

    return {
      code: fv.code,
      password: fv.password,
    }
  }

  private setMinPasswordLength(): void {
    this.configs.get(`minPasswordLength`).subscribe((minPasswordLength: number) => {
      if (minPasswordLength && !isNaN(minPasswordLength) && minPasswordLength > 0) {
        this.form.get(`password`)?.setValidators([Validators.required, Validators.minLength(minPasswordLength)]);
        // this.form.get(`passwordConfirmation`)?.setValidators([
        //   Validators.required,
        //   Validators.minLength(minPasswordLength),
        //   (control: FormControl): ValidationErrors | null => {
        //     const password = this.form.get(`password`)?.value;
        //     if (!password) return null;

        //     if (control.value !== password) return { passwordConfirmation: true };

        //     return null;
        //   },
        // ]);
      }
    });
  }

  private readCodeFromRoute(): void {
    this.route.params.subscribe((params: Record<string, any>) => {
      if (params['code']) this.form.get(`code`)?.setValue(params['code']);
    });

    // const params = this.route.snapshot.queryParams;
    // Object.keys(params).forEach((key: string) => {
    //   if (this.form.get(key)) this.form.get(key)?.setValue(params[key]);
    // });
  }
}
