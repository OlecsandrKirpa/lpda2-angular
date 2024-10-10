import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServerError } from '@core/lib/interfaces/server-error';
import { ProfileService } from '@core/services/http/profile.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputPasswordModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-edit-password',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    TuiLoaderModule,
    TuiInputPasswordModule,
    TuiTextfieldControllerModule,
    TuiAutoFocusModule,
    TuiButtonModule,
    MatIconModule,
  ],
  templateUrl: './edit-password.page.html',
  styleUrl: './edit-password.page.scss'
})
export class EditPasswordPage {
  public submitting: boolean = false;
  public current_password: FormControl = new FormControl(null, [Validators.required]);
  public new_password: FormControl = new FormControl(null, [Validators.required]);

  public form: FormGroup = new FormGroup({
    current_password: this.current_password,
    new_password: this.new_password
  });

  private readonly profile: ProfileService = inject(ProfileService);
  private readonly router: Router = inject(Router);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly notification: NotificationsService = inject(NotificationsService);

  submit(): void {
    if(this.form.invalid) return;

    this.submitting = true;

    this.profile.changePassword(this.current_password.value, this.new_password.value).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['..'], { relativeTo: this.activeRoute });
        this.notification.fireSnackBar($localize`Password aggiornata con successo!`);
      },
      error: (error: HttpErrorResponse) => {
        this.submitting = false;

        if(error.status === 422){
          const errors: ServerError[] = error.error.errors;
          errors.forEach((error: ServerError) => {
            const error_code = `${error.field}:${error.code}`;
            switch(error_code){
              case 'current_password:missing':
              case 'current_password:blank':
                this.current_password.setErrors({ required: true });
                break;
              case 'current_password:invalid':
                this.current_password.setErrors({ invalid: error.message });
                break;
              case 'new_password:missing':
              case 'new_password:blank':
                this.new_password.setErrors({ required: true });
                break;
              case 'new_password:too_short':
                this.new_password.setErrors({ tooShort: error.message });
                break;
              case 'user:blocked':
                this.current_password.setErrors({ userBlocked: error.message });
                break;
              default:
                console.error(`Unhandled error: ${error_code}: ${error.message}`);
            }
          });
        }
      },
    });
  }
}
