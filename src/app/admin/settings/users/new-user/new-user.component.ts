import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {TuiAutoFocusModule, TuiDestroyService} from "@taiga-ui/cdk";
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {TuiCheckboxBlockModule, TuiInputModule} from "@taiga-ui/kit";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {TuiButtonModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {UsersService} from "@core/services/http/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "@core/models/user";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {NotificationsService} from "@core/services/notifications.service";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    ErrorsComponent,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    TuiCheckboxBlockModule,
    TuiAutoFocusModule
  ],
  templateUrl: './new-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class NewUserComponent {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly service: UsersService = inject(UsersService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  readonly form: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    can_root: new FormControl(false),
  });

  readonly submitting: WritableSignal<boolean> = signal(false);

  private submitted: boolean = false;

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.service.create(this.formVal()).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.submitting.set(false))
    ).subscribe({
      next: (record: User): void => {
        this.notifications.fireSnackBar($localize`Utente creato.`);
        this.router.navigate(['..'], {relativeTo: this.route});
      },
      error: (res: HttpErrorResponse): void => {
        ReactiveErrors.assignErrorsToForm(this.form, res);
        this.notifications.error(parseHttpErrorMessage(res) || SOMETHING_WENT_WRONG_MESSAGE);
      }
    });
  }

  cancel(): void {
    const needConfirm: boolean = this.form.dirty || this.form.touched;
    if (!needConfirm || (needConfirm && confirm($localize`Sei sicuro di voler annullare?`))) {
      this.router.navigate(['..'], {relativeTo: this.route});
    }
  }

  readonly e = this.errorsFor;

  private errorsFor(controlName: string): ValidationErrors | null {
    const c = this.form.get(controlName);

    return c && (c.touched || c.dirty || this.submitted) ? c.errors : null;
  }

  private formVal(): Record<string, any> {
    const formVal = {
      ...this.form.value
    };

    return formVal;
  }
}
