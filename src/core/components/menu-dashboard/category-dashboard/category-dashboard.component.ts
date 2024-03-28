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
import {TuiDestroyService, TuiRepeatTimesModule} from "@taiga-ui/cdk";
import {ActivatedRoute, Params, Router, RouterLink, RouterOutlet} from "@angular/router";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import {DishesService} from "@core/services/http/dishes.service";
import {NotificationsService} from "@core/services/notifications.service";
import {MenuCategory} from "@core/models/menu-category";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {CategoryDetailsComponent} from "@core/components/menu-dashboard/category-details/category-details.component";
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiLoaderModule
} from "@taiga-ui/core";
import {ListItemsComponent} from "@core/components/menu-dashboard/list-items/list-items.component";
import {MenuCategoryDashboardData} from "@core/lib/interfaces/menu-category-dashboard-data";
import {TuiBreadcrumbsModule, TuiInputNumberModule} from "@taiga-ui/kit";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {UrlToPipe} from "@core/pipes/url-to.pipe";
import {
  CategoryBreadcrumbsComponent
} from "@core/components/menu-dashboard/category-breadcrumbs/category-breadcrumbs.component";

@Component({
  selector: 'app-category-dashboard',
  standalone: true,
  imports: [
    CategoryDetailsComponent,
    TuiLoaderModule,
    ListItemsComponent,
    RouterOutlet,
    CategoryBreadcrumbsComponent,
    TuiLinkModule,
    RouterLink
  ],
  templateUrl: './category-dashboard.component.html',
  styleUrl: './category-dashboard.component.scss',
  providers: [
    TuiDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryDashboardComponent implements OnInit {
  /**
   * SERVICES
   */
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly categoriesService: MenuCategoriesService = inject(MenuCategoriesService);
  private readonly dishesService: DishesService = inject(DishesService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  categoryId: number | null = null;

  readonly loadingData: WritableSignal<boolean> = signal(false);
  readonly loadingCategory: WritableSignal<boolean> = signal(false);

  readonly loading: Signal<boolean> = computed(() => this.loadingCategory() || this.loadingData());
  // readonly loading: WritableSignal<boolean> = signal(false);
  readonly category: WritableSignal<MenuCategory | null> = signal(null);

  readonly data: WritableSignal<MenuCategoryDashboardData | null> = signal(null);
  readonly breadcrumbs: Signal<MenuCategoryDashboardData['breadcrumbs']> = computed(() => this.data()?.breadcrumbs ?? []);

  max = 1;

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Lifecycle hooks
   */
  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params: Params) => {
      this.categoryId = Number(params['category_id']);
      console.assert(!isNaN(this.categoryId) && this.categoryId > 0, 'Category id is required');
      this.loadCategory();
      this.loadData();
    });
  }

  /**
   * Private methods
   */
  private loadCategory(categoryId: number = this.categoryId!): void {
    console.assert(!isNaN(categoryId) && categoryId > 0, 'Category id is required');

    this.loadingCategory.set(true);
    this.categoriesService.show(categoryId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingCategory.set(false)),
    ).subscribe({
      next: (category: MenuCategory): void => this.setCategory(category),
      error: (r: HttpErrorResponse): void => {
        this.setCategory(null);
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto. Riprova più tardi.`)
      },
    });
  }

  private loadData(categoryId: number = this.categoryId!): void {
    console.assert(!isNaN(categoryId) && categoryId > 0, 'Category id is required');

    this.loadingData.set(true);
    this.categoriesService.dashboardData(categoryId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingData.set(false))
    ).subscribe({
      next: (data): void => this.data.set(data),
      error: (r: HttpErrorResponse): void => this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto. Riprova più tardi.`),
    });
  }

  private setCategory(category: MenuCategory | null): void {
    this.category.set(category);
  }
}