import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {tap, debounceTime, takeUntil} from 'rxjs';
import {ErrorsComponent} from '@core/components/errors/errors.component';
import {TuiAutoFocusModule, TuiDestroyService} from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiDialogService,
  TuiLoaderModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import {TuiInputModule, TuiInputPasswordModule} from '@taiga-ui/kit';
import {AuthService} from '@core/services/http/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationsService} from "@core/services/notifications.service";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-require-reset-password',
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
  templateUrl: './require-reset-password.component.html',
  styleUrls: ['./require-reset-password.component.scss'],
  providers: [
    TuiDestroyService
  ]
})
export class RequireResetPasswordComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly router = inject(Router);
  private readonly destroy$ = inject(TuiDestroyService);
  private readonly notifications = inject(NotificationsService);

  readonly _ = inject(Title).setTitle($localize`Password dimenticata | La Porta D'Acqua`);

  readonly form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  submitted: boolean = false;

  loading: boolean = false;

  typing: boolean = false;

  ngOnInit(): void {
    this.updateEmailFromQueryParams();
  }

  private readonly type$ = this.form.valueChanges.pipe(
    takeUntilDestroyed(),
    tap(() => this.typing = true),
    debounceTime(1000),
    tap(() => this.typing = false),
  ).subscribe();

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    this.auth.requireResetPassword(this.form.value.email).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (): void => {
        this.loading = false;
        this.showEmailDialog();
      }, error: (e: HttpErrorResponse): void => {
        this.loading = false;
        this.notifications.error(parseHttpErrorMessage(e) || SOMETHING_WENT_WRONG_MESSAGE);
      }
    });
  }

  private updateEmailFromQueryParams(): void {
    const email = this.route.snapshot.queryParams['email'];

    if (email) this.form.patchValue({email});
  }

  private showEmailDialog(): void {
    this.dialogs
      .open($localize`Le abbiamo inviato un email con i dettagli su come resettare la password.`, {
        label: $localize`Email inviata`,
        size: 'l',
        data: {button: `Grazie`},
      })
      .subscribe({
        error: (e: any) => console.error('Dialog closed', e),
        complete: () => this.router.navigate(['/auth'], {queryParams: {email: this.form.value.email}})
      });
  }
}
