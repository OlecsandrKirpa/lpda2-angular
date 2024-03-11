import {Component, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TuiButtonModule, TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {I18nInputComponent} from "@core/components/i18n-input/i18n-input.component";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {ImageInputComponent} from "@core/components/image-input/image-input.component";
import {JsonPipe} from "@angular/common";
import {TuiInputModule, TuiTextareaModule} from "@taiga-ui/kit";
import {IngredientFormComponent} from "@core/components/ingredient-form/ingredient-form.component";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {IngredientsService} from "@core/services/http/ingredients.service";
import {NotificationsService} from "@core/services/notifications.service";
import {takeUntil} from "rxjs";
import {Ingredient} from "@core/models/ingredient";
import {HttpErrorResponse} from "@angular/common/http";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";

@Component({
  selector: 'app-new-ingredient',
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
    IngredientFormComponent,
  ],
  templateUrl: './new-ingredient.component.html',
  providers: [
    TuiDestroyService
  ]
})
export class NewIngredientComponent {
private readonly service: IngredientsService = inject(IngredientsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly loading: WritableSignal<boolean> = signal(false);

  @ViewChild(IngredientFormComponent) formComponent?: IngredientFormComponent;

  submit(formVal: FormData): void {
    this.loading.set(true);
    this.service.create(formVal).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (item: Ingredient): void => {
        this.notifications.fireSnackBar($localize`Ingrediente salvato`);
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
