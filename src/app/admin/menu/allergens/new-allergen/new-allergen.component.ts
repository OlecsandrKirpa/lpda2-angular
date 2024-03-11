import {ChangeDetectionStrategy, Component, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TuiButtonModule, TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {AllergensService} from "@core/services/http/allergens.service";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Allergen} from "@core/models/allergen";
import {I18nInputComponent} from "@core/components/i18n-input/i18n-input.component";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {ImageInputComponent} from "@core/components/image-input/image-input.component";
import {JsonPipe} from "@angular/common";
import {TuiInputModule, TuiTextareaModule} from "@taiga-ui/kit";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {NotificationsService} from "@core/services/notifications.service";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {AllergenFormComponent} from "@core/components/allergen-form/allergen-form.component";

@Component({
  selector: 'app-new-allergen',
  standalone: true,
  imports: [
    RouterLink,
    TuiLinkModule,
    MatIcon,
    ReactiveFormsModule,
    I18nInputComponent,
    ErrorsComponent,
    ImageInputComponent,
    TuiButtonModule,
    JsonPipe,
    TuiInputModule,
    TuiTextareaModule,
    AllergenFormComponent,
  ],
  templateUrl: './new-allergen.component.html',
  styleUrl: './new-allergen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class NewAllergenComponent {
  private readonly service: AllergensService = inject(AllergensService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly loading: WritableSignal<boolean> = signal(false);

  @ViewChild(AllergenFormComponent) formComponent?: AllergenFormComponent;

  submit(formVal: FormData): void {
    this.loading.set(true);
    this.service.create(formVal).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (item: Allergen): void => {
        this.notifications.fireSnackBar($localize`Allergene salvato`);
        this.router.navigate([`..`], {relativeTo: this.route});
      },
      error: (errors: HttpErrorResponse): void => {
        if (this.formComponent) ReactiveErrors.assignErrorsToForm(this.formComponent.form, errors);
        this.notifications.error(parseHttpErrorMessage(errors) || $localize`Qualcosa è andato storto nel salvataggio.`);
      }
    });
  }

  cancel(): void {
    // if (!(this.form.touched || this.form.dirty)) return this.navigateBack();

    if (confirm($localize`Sei sicuro di voler annullare?`)) this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['..'], {relativeTo: this.route});
  }
}
