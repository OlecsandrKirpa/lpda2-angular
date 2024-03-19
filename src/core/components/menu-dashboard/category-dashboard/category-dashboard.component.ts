import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ActivatedRoute, Params, Router, RouterOutlet} from "@angular/router";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import {DishesService} from "@core/services/http/dishes.service";
import {NotificationsService} from "@core/services/notifications.service";
import {MenuCategory} from "@core/models/menu-category";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {CategoryDetailsComponent} from "@core/components/menu-dashboard/category-details/category-details.component";
import {TuiLoaderModule} from "@taiga-ui/core";
import {ListItemsComponent} from "@core/components/menu-dashboard/list-items/list-items.component";

@Component({
  selector: 'app-category-dashboard',
  standalone: true,
  imports: [
    CategoryDetailsComponent,
    TuiLoaderModule,
    ListItemsComponent,
    RouterOutlet
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

  private categoryId: number | null = null;

  readonly loading: WritableSignal<boolean> = signal(false);
  readonly category: WritableSignal<MenuCategory | null> = signal(null);

  /**
   * Constructor
   */
  constructor() {  }

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
    });
  }

  /**
   * Private methods
   */
  private loadCategory(categoryId: number = this.categoryId!): void {
    console.assert(!isNaN(categoryId) && categoryId > 0, 'Category id is required');

    this.loading.set(true);
    this.categoriesService.show(categoryId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (category: MenuCategory): void => this.setCategory(category),
      error: (r: HttpErrorResponse): void => this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto. Riprova più tardi.`),
    });
  }

  private setCategory(category: MenuCategory): void {
    this.category.set(category);
  }
}