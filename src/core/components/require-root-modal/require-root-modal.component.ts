import { ChangeDetectionStrategy, Component, Inject, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/http/auth.service';
import { TuiButtonModule, TuiDialogContext, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { ErrorsComponent } from '../errors/errors.component';
import {POLYMORPHEUS_CONTEXT, PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveErrors } from '@core/lib/reactive-errors/reactive-errors';
import { SessionService } from '@core/services/admin-session.service';
import { ProfileService } from '@core/services/http/profile.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { finalize } from 'rxjs';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';

@Component({
  selector: 'app-require-root-modal',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiLoaderModule,
    ReactiveFormsModule,
    ErrorsComponent,
    TuiInputModule,
    TuiAutoFocusModule,
    TuiTextfieldControllerModule,
    TuiInputPasswordModule,
  ],
  templateUrl: './require-root-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequireRootModalComponent {
  private readonly auth: AuthService = inject(AuthService);
  private readonly profile: ProfileService = inject(ProfileService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly cu = this.profile.cu;

  readonly password = new FormControl<string | null>(null, [Validators.required]);

  readonly submitted: WritableSignal<boolean> = signal(false);

  readonly form = new FormGroup<{password: FormControl<string | null>}>({
    password: this.password
  });

  readonly loading: WritableSignal<boolean> = signal(false);

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<unknown, unknown>,
  ) { }

  submit(): void {
    this.submitted.set(true);
    const pwd = this.password.value;
    if (this.form.invalid) return;
    if (!(typeof pwd === 'string' && pwd.length > 0)) return;

    this.loading.set(true);

    this.auth.root(pwd).pipe(
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (something: any) => {
        this.context.completeWith(true);
        this.notifications.fireSnackBar($localize`Modalità amministratore attiva.`);
      },
      error: (error: HttpErrorResponse) => {
        ReactiveErrors.assignErrorsToForm(this.form, error);
        this.notifications.error(parseHttpErrorMessage(error))
      }
    });
  }

  close(): void {
    this.notifications.fireSnackBar($localize`Azione annullata.`);
    this.context.completeWith(false);
  }
}
