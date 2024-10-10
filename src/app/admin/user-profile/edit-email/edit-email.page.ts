import { Component, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '@core/services/http/profile.service';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLinkModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { MaskitoModule } from '@maskito/angular';
import { OtpInputComponent } from '@core/components/otp-input/otp-input.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerError } from '@core/lib/interfaces/server-error';
import { NotificationsService } from '@core/services/notifications.service';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';

@Component({
  selector: 'app-edit-email',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    MatStepperModule,
    TuiAutoFocusModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiLoaderModule,
    MaskitoModule,
    OtpInputComponent,
  ],
  templateUrl: './edit-email.page.html',
  styleUrl: './edit-email.page.scss'
})
export class EditEmailPage {
  @ViewChild('stepper') stepper?: MatStepper;

  public submitting: boolean = false;
  public email: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  public otp: FormControl = new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
  public form: FormGroup = new FormGroup({ email: this.email, otp: this.otp });

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly profile: ProfileService = inject(ProfileService);
  private readonly notification: NotificationsService = inject(NotificationsService);

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  next(): void {
    if(!this.stepper) return;

    switch(this.stepper.selected?.stepControl){
      case this.email:
        this.sendVerificationEmail();
        break;
      case this.otp:
        this.changeEmail();
        break;
    }
  }

  back(): void {
    if(!this.stepper) return;
    this.stepper.previous();
  }

  private sendVerificationEmail(): void {
    if(this.email.invalid) return;

    this.submitting = true;
    this.profile.sendEmailVerificationOtp(this.email.value).subscribe({
      next: () => {
        this.submitting = false;
        this.stepper?.next();
      },
      error: (error: HttpErrorResponse) => {
        this.submitting = false;
        if(error.status === 422){
          const errors: ServerError[] = error.error.errors;
          errors.forEach((error: ServerError) => {
            const error_code = `${error.field}:${error.code}`;
            switch(error_code){
              case 'email:missing':
              case 'email:blank':
                this.email.setErrors({ required: true });
                break;
              case 'email:invalid':
                this.email.setErrors({ invalid: error.message });
                break;
              case 'email:taken':
                this.email.setErrors({ taken: true });
                break;
              case 'email:not_changed':
                this.email.setErrors({ notChanged: true });
                break;
              case 'user:blocked':
                this.email.setErrors({ userBlocked: true });
                break;
            }
          });
        } else {
          this.notification.error(parseHttpErrorMessage(error) || SOMETHING_WENT_WRONG_MESSAGE);
        }
      }
    });
  }

  private changeEmail(): void {
    if(this.otp.invalid) return;

    this.submitting = true;
    this.profile.changeEmail(this.email.value, this.otp.value).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        this.notification.fireSnackBar($localize`Indirizzo email aggiornato con successo!`);
      },
      error: (error: HttpErrorResponse) => {
        this.submitting = false;
        if(error.status === 422){
          const errors: ServerError[] = error.error.errors;
          errors.forEach((error: ServerError) => {
            const error_code = `${error.field}:${error.code}`;
            switch(error_code){
              case 'email:missing':
              case 'email:blank':
                this.otp.setErrors({ emailBlank: true });
                break;
              case 'email:invalid':
                this.otp.setErrors({ emailInvalid: error.message });
                break;
              case 'email:taken':
                this.otp.setErrors({ emailTaken: true });
                break;
              case 'email:not_changed':
                this.otp.setErrors({ emailNotChanged: true });
                break;
              case 'user:blocked':
                this.otp.setErrors({ userBlocked: true });
                break;
              case 'otp:missing':
              case 'otp:blank':
                this.otp.setErrors({ required: true });
                break;
              case 'otp:invalid':
                this.otp.setErrors({ invalid: error.message });
                break;
            }
          });
        }
      }
    });
  }
}
