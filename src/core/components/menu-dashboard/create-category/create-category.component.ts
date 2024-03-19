import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {TuiButtonModule, TuiGroupModule, TuiTooltipModule} from "@taiga-ui/core";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {I18nInputComponent} from "@core/components/i18n-input/i18n-input.component";
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import {finalize, takeUntil} from "rxjs";
import {MenuCategory} from "@core/models/menu-category";
import {UrlToPipe} from "@core/pipes/url-to.pipe";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {NotificationsService} from "@core/services/notifications.service";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {TuiRadioBlockModule} from "@taiga-ui/kit";
import {NgForOf} from "@angular/common";
import {
  MenuCategorySelectComponent
} from "@core/components/dynamic-selects/menu-category-select/menu-category-select.component";
import {CustomValidators} from "@core/lib/custom-validators";

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [
    TuiButtonModule,
    ErrorsComponent,
    I18nInputComponent,
    ReactiveFormsModule,
    TuiGroupModule,
    TuiRadioBlockModule,
    NgForOf,
    TuiTooltipModule,
    MenuCategorySelectComponent,
  ],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss',
  providers: [
    TuiDestroyService,
    UrlToPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCategoryComponent implements OnInit {
  private readonly service: MenuCategoriesService = inject(MenuCategoriesService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly urlTo: UrlToPipe = inject(UrlToPipe);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly afterUrl: string | null | undefined = this.route.snapshot.queryParams['afterUrl'];

  readonly form: FormGroup = new FormGroup({
    name: new FormControl(null),
  });

  readonly parent: FormControl =  new FormControl(null, [Validators.required, CustomValidators.instanceof(MenuCategory)]);
  readonly askParent: FormControl = new FormControl<any>(true);

  readonly loading: WritableSignal<boolean> = signal(false);

  submitted: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (params: Params): void => {
        if (params['parent_id']){
          this.parent.setValue(params['parent_id']);
          this.askParent.setValue(true);
        } else {
          this.askParent.setValue(false);
        }
      }
    });

    this.askParent.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe((value: boolean) => {
      if (value) {
        this.form.get('parent')?.enable();
      } else {
        this.form.get('parent')?.disable();
      }
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    if (this.askParent.value && this.parent.invalid) return;

    this.loading.set(true);
    this.service.create(this.formData()).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (record: MenuCategory): void => {
        const url: string | null = this.afterUrl || this.urlTo.transform(record.id, `menuCategory.show`);
        console.assert(url, `URL for menu category ${record.id} not found`);
        this.router.navigate([url], {relativeTo: this.route});
      },
      error: (errors: HttpErrorResponse): void => {
        ReactiveErrors.assignErrorsToForm(this.form, errors);
        this.notifications.error(parseHttpErrorMessage(errors) || $localize`Qualcosa è andato storto nel salvataggio della categoria.`);
      }
    })
  }

  private formData(): Record<string, string | number> {
    const formVal = this.form.value;

    if (this.askParent.value && this.parent.value instanceof MenuCategory) formVal['parent_id'] = this.parent.value.id;

    return formVal;
  }

  e = this.errorsFor;

  private errorsFor(controlName: string): ValidationErrors | null {
    const control = this.form.get(controlName);
    if (!(control)) return null;

    if (control.dirty || control.touched || this.submitted) {
      return control.errors;
    }

    return null;
  }

  cancel(): void {
    const url: string = this.afterUrl || '..';
    this.router.navigate([url], {relativeTo: this.route});
  }
}
