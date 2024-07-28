import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {PublicMessagesService} from "@core/services/http/public-messages.service";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {PublicMessage} from "@core/models/public-message";
import {filter, finalize, map, switchMap, takeUntil, tap} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationsService} from "@core/services/notifications.service";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {I18nInputComponent} from "@core/components/i18n-input/i18n-input.component";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {TuiButtonModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiDataListWrapperModule, TuiSelectModule} from "@taiga-ui/kit";
import {isPublicMessageKey, PublicMessageKey, PublicMessageLocations} from "@core/lib/interfaces/public-message";
import {PublicMessageKeyPipe} from "@core/pipes/public-message-key.pipe";
import {NgTemplateOutlet} from "@angular/common";
import {nue} from "@core/lib/nue";

@Component({
  selector: 'app-edit-public-message',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    I18nInputComponent,
    ErrorsComponent,
    TuiButtonModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    PublicMessageKeyPipe,
    NgTemplateOutlet
  ],
  templateUrl: './edit-public-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class EditPublicMessageComponent implements OnInit {
  private readonly service: PublicMessagesService = inject(PublicMessagesService)
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly loading: WritableSignal<boolean> = signal(false);
  readonly keys: string[] = [...PublicMessageLocations];

  private readonly submitted: WritableSignal<boolean> = signal(false);

  readonly form: FormGroup = new FormGroup({
    key: new FormControl(null, [Validators.required]),
    text: new FormControl(null),
  })

  ngOnInit(): void {
    this.form.get(`key`)?.valueChanges?.pipe(
      takeUntil(this.destroy$),
      filter((key: unknown): key is PublicMessageKey => isPublicMessageKey(key)),
      switchMap((key: PublicMessageKey) => this.service.show(key)),
    ).subscribe({
      next: (message: PublicMessage): void => {
        this.form.patchValue({
          text: message.translations?.text
        })
      },
      error: (error: HttpErrorResponse): void => {
        console.warn(error);
      }
    });

    this.route.params.pipe(
      takeUntil(this.destroy$),
      map((params: Params) => params['key']),
      filter((key: unknown): key is PublicMessageKey => isPublicMessageKey(key)),
      tap((key: PublicMessageKey) => this.form.patchValue({key: key})),
      tap(() => this.form.controls["key"].disable()),
    ).subscribe(nue());
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.loading.set(true);

    this.service.create(this.formVal()).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: () => {
        this.notifications.fireSnackBar($localize`Salvato`);
      },
      error: (error: unknown): void => {
        if (error instanceof HttpErrorResponse && error.status == 422) {
          ReactiveErrors.assignErrorsToForm(this.form, error);
        } else {
          this.notifications.error(error instanceof HttpErrorResponse ? parseHttpErrorMessage(error) : SOMETHING_WENT_WRONG_MESSAGE);
        }
      }
    })
  }

  cancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  e = this.errorsFor;

  private errorsFor(controlName: string): ValidationErrors | null {
    const control = this.form.get(controlName);
    if (!(control)) return null;

    if (control.dirty || control.touched || this.submitted()) {
      return control.errors;
    }

    return null;
  }

  private formVal(): { key: string, text: Record<string, string | null> } {
    return {
      key: this.form.controls["key"].value,
      text: this.form.value.text
    }
  }
}
