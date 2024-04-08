import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {TuiButtonModule, TuiTooltipModule} from "@taiga-ui/core";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DishSelectComponent} from "@core/components/dynamic-selects/dish-select/dish-select.component";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NotificationsService} from "@core/services/notifications.service";
import {MenuCategory} from "@core/models/menu-category";
import {distinctUntilChanged, finalize, map, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";

@Component({
  selector: 'app-link-dish',
  standalone: true,
  imports: [
    TuiTooltipModule,
    ReactiveFormsModule,
    DishSelectComponent,
    TuiButtonModule
  ],
  templateUrl: './link-dish.component.html',
  styleUrl: './link-dish.component.scss',
  providers: [
    TuiDestroyService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkDishComponent implements OnInit {
  private readonly service: MenuCategoriesService = inject(MenuCategoriesService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly loading: WritableSignal<boolean> = signal(false);
  readonly category: WritableSignal<MenuCategory | null> = signal(null);

  categoryId?: number | null = null;

  readonly form: FormGroup = new FormGroup({
    dish: new FormControl<MenuCategory | null>(null),
  });

  ngOnInit(): void {
    this.route.parent?.parent?.params.pipe(
      takeUntil(this.destroy$),
      map((params: Params) => params['category_id']),
      distinctUntilChanged(),
    ).subscribe({
      next: (categoryId: number | null) => {
        this.categoryId = categoryId;
        this.loadCategory();
      }
    })
  }

  submit(): void {
    const categoryId = this.categoryId;
    const dishId = this.form.value?.dish?.id;
    if (!(categoryId && dishId)) {
      console.error(`something invalid.`, {categoryId, dishId})
      return;
    }

    if (this.form.invalid) return;

    this.loading.set(true);
    this.service.addDish(categoryId, dishId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        this.navigateBack();
        this.notifications.fireSnackBar($localize`Piatto aggiunto.`)
      },
      error: (r: HttpErrorResponse): void => {
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto nell'aggiunta del piatto.`);
      }
    });
  }

  cancel(): void {
    if ((this.form.touched || this.form.dirty) && !confirm($localize`Sei sicuro di voler annullare questa azione?`)) return;

    this.navigateBack();
  }

  private navigateBack(): void {
    const afterUrl = this.route.snapshot.queryParams['afterUrl'];
    if (afterUrl) {
      this.router.navigateByUrl(afterUrl);
      return;
    }

    this.router.navigate(['..'], {relativeTo: this.route});
  }

  private loadCategory(): void {
    this.category.set(null);

    if (!(this.categoryId)) {
      return;
    }

    this.service.show(this.categoryId).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (record: MenuCategory): void => {
        this.category.set(record);
      },
      error: (r: HttpErrorResponse): void => {
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto nel caricamento della categoria padre.`);
      }
    });
  }
}
