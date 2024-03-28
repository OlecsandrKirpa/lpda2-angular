import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {UrlToPipe} from "@core/pipes/url-to.pipe";
import {DishesService} from "@core/services/http/dishes.service";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {NotificationsService} from "@core/services/notifications.service";
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {CustomValidators} from "@core/lib/custom-validators";
import {MenuCategory} from "@core/models/menu-category";
import {distinctUntilChanged, filter, finalize, map, Observable, switchMap, takeUntil, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {Dish} from "@core/models/dish";
import {TuiButtonModule, TuiLinkModule} from "@taiga-ui/core";
import {I18nInputComponent} from "@core/components/i18n-input/i18n-input.component";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import {JsonPipe} from "@angular/common";

@Component({
  standalone: true,
  imports: [
    UrlToPipe,
    RouterLink,
    TuiLinkModule,
    ReactiveFormsModule,
    I18nInputComponent,
    ErrorsComponent,
    TuiButtonModule,
    JsonPipe
  ],
  templateUrl: './create-dish.component.html',
  providers: [
    TuiDestroyService,
    UrlToPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDishComponent implements OnInit {
  private readonly categoriesService: MenuCategoriesService = inject(MenuCategoriesService);
  private readonly service: DishesService = inject(DishesService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly urlTo: UrlToPipe = inject(UrlToPipe);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly afterUrl: string | null | undefined = this.route.snapshot.queryParams['afterUrl'];

  readonly form: FormGroup = new FormGroup({
    name: new FormControl(null),
  });

  readonly category: WritableSignal<MenuCategory | null> = signal(null);

  readonly loading: WritableSignal<boolean> = signal(false);

  submitted: boolean = false;

  ngOnInit(): void {
    this.listenForEvents(this.route.queryParams);
    this.listenForEvents(this.route.params);
    if (this.route.parent) this.listenForEvents(this.route.parent.params);
    if (this.route.parent?.parent) this.listenForEvents(this.route.parent?.parent.params);
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading.set(true);
    this.service.create(this.formData()).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (record: Dish): void => {
        if (typeof this.afterUrl == 'string' && this.afterUrl.length > 0) {
          this.router.navigateByUrl(this.afterUrl);
        } else {
          this.router.navigate([`../dish/${record.id}`], {relativeTo: this.route});
        }
        // const url: string | null = this.afterUrl || this.urlTo.transform(record.id, `dish.show`);
        // console.assert(url, `URL for dish ${record.id} not found`);
        // this.router.navigate([url], {relativeTo: this.route});
        this.notifications.fireSnackBar($localize`Piatto creata.`);
      },
      error: (errors: HttpErrorResponse): void => {
        ReactiveErrors.assignErrorsToForm(this.form, errors);
        this.notifications.error(parseHttpErrorMessage(errors) || $localize`Qualcosa è andato storto nel salvataggio del piatto.`);
      }
    })
  }

  cancel(): void {
    const url: string = this.afterUrl || '..';
    this.router.navigate([url], {relativeTo: this.route});
  }

  e = this.errorsFor;

  formData(): Record<string, string | number> {
    const formVal = this.form.value;

    formVal['category_id'] = this.category()?.id ?? null;

    return formVal;
  }


  private errorsFor(controlName: string): ValidationErrors | null {
    const control = this.form.get(controlName);
    if (!(control)) return null;

    if (control.dirty || control.touched || this.submitted) {
      return control.errors;
    }

    return null;
  }

  private loadCategory(id: number): void {
    this.categoriesService.show(id).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (category: MenuCategory): void => {
        this.category.set(category);
      },
      error: (error: unknown): void => {
        this.category.set(null);
        console.error(error);
        this.notifications.error($localize`Ci sono stati degli errori.`);
      }
    });
  }

  private listenForEvents(source: Observable<Params>): void {
    source.pipe(
      takeUntil(this.destroy$),
      map((p: Params): unknown => Number(p['category_id'] || p['parent_id'])),
      filter((id: unknown): id is number => typeof id === 'number' && !isNaN(id) && id > 0),
      distinctUntilChanged(),
    ).subscribe({
      next: (id: number) => this.loadCategory(id),
    });
  }
}
