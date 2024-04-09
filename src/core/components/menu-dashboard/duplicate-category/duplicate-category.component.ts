import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {MenuCategoriesService} from '@core/services/http/menu-categories.service';
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {CustomValidators} from "@core/lib/custom-validators";
import {finalize, takeUntil} from "rxjs";
import {NotificationsService} from "@core/services/notifications.service";
import {MenuCategory} from "@core/models/menu-category";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {CopyMenuCategoryParams} from "@core/lib/interfaces/copy-menu-category-params";
import {
  MenuCategorySelectComponent
} from "@core/components/dynamic-selects/menu-category-select/menu-category-select.component";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {TuiButtonModule, TuiExpandModule, TuiGroupModule, TuiLinkModule} from "@taiga-ui/core";
import {TuiRadioBlockModule} from "@taiga-ui/kit";
import {JsonPipe} from "@angular/common";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";
import {UrlToPipe} from "@core/pipes/url-to.pipe";

@Component({
  selector: 'app-duplicate-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MenuCategorySelectComponent,
    ErrorsComponent,
    TuiGroupModule,
    TuiRadioBlockModule,
    TuiButtonModule,
    TuiExpandModule,
    TuiLinkModule,
    RouterLink,
    UrlToPipe,
  ],
  templateUrl: './duplicate-category.component.html',
  styleUrl: './duplicate-category.component.scss',
  providers: [
    TuiDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DuplicateCategoryComponent implements OnInit {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly service: MenuCategoriesService = inject(MenuCategoriesService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  private submitted: boolean = false;
  category: WritableSignal<MenuCategory | null> = signal(null);

  readonly form: FormGroup = new FormGroup({
    copy_dishes: new FormControl("full", [Validators.required, CustomValidators.in(["full", "link", "none"])]),
    copy_images: new FormControl("full", [Validators.required, CustomValidators.in(["full", "link", "none"])]),
    copy_children: new FormControl("full", [Validators.required, CustomValidators.in(["full", "none"])]),
    create_as_root: new FormControl(false),
    parent: new FormControl(null, [CustomValidators.instanceof(MenuCategory)]),
  });

  readonly saving: WritableSignal<boolean> = signal(false);
  readonly loading: Signal<boolean> = computed(() => this.saving());

  ngOnInit(): void {
    this.route.parent?.parent?.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (p: Params): void => {
        this.loadCategory(p['category_id']);
      }
    })
  }

  readonly e = this.getErrorsFor;

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    const id: number | undefined = this.category()?.id;
    if (!id) throw new Error(`Category id invalid: ${id}`);

    this.saving.set(true);
    this.service.copy(id, this.formValue()).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.saving.set(false)),
    ).subscribe({
      next: (v: MenuCategory) => {
        this.notifications.fireSnackBar($localize`Duplicato.`);
        this.router.navigate(['../..', v.id], {relativeTo: this.route});
      },
      error: (r: HttpErrorResponse) => {
        this.manageError(r);
      }
    })
  }

  cancel(): void {
    if ((this.form.touched || this.form.dirty) && !(confirm($localize`Sei sicuro di voler annullare le modifiche fatte?`))) return;

    this.notifications.fireSnackBar($localize`Operazione annullata`);
    this.navigateBack();
  }

  private formValue(): CopyMenuCategoryParams {
    return {
      copy_dishes: this.form.value['copy_dishes'],
      copy_images: this.form.value['copy_images'],
      copy_children: this.form.value['copy_children'],
      parent_id: this.form.value['create_as_root'] ? null : (this.form.value['parent']?.id ?? null)
    };
  }

  private navigateBack(): void {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  private manageError(r: HttpErrorResponse): void {
    if (r.status != 422) {
      this.notifications.error(parseHttpErrorMessage(r) || SOMETHING_WENT_WRONG_MESSAGE);
      return;
    }

    ReactiveErrors.assignErrorsToForm(this.form, r);
  }

  private getErrorsFor(controlName: string): ValidationErrors | null {
    const control = this.form.get(controlName);
    if (!(control)) return null;

    if (this.submitted || control.touched || control.dirty) return control.errors;

    return null;
  }

  private loadCategory(id: number | null | undefined): void {
    if (!(id)) return;

    this.service.show(id).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (record: MenuCategory): void => {
        this.category.set(record);
      },
      error: (r: HttpErrorResponse): void => {
        this.notifications.error(parseHttpErrorMessage(r) || SOMETHING_WENT_WRONG_MESSAGE);
      }
    })
  }
}
