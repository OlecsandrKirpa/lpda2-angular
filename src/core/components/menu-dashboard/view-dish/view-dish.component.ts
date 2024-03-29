import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ShowImagesComponent} from "@core/components/show-images/show-images.component";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {DishesService} from "@core/services/http/dishes.service";
import {NotificationsService} from "@core/services/notifications.service";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {Dish} from "@core/models/dish";
import {distinctUntilChanged, filter, finalize, map, takeUntil, tap} from "rxjs";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {HttpErrorResponse} from "@angular/common/http";
import {TuiButtonModule, TuiLoaderModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: '__app-view-dish',
  standalone: true,
  imports: [
    ShowImagesComponent,
    TuiLoaderModule,
    TuiButtonModule,
    RouterLink,
    MatIcon
  ],
  templateUrl: './view-dish.component.html',
  styleUrl: './view-dish.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class ViewDishComponent implements OnInit {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly service: DishesService = inject(DishesService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly loading: WritableSignal<boolean> = signal(false);
  readonly dish: WritableSignal<Dish | null> = signal(null);
  readonly dishId: WritableSignal<number | null> = signal(null);

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      map((params: Params) => Number(params['dish_id'])),
      filter((dishId: unknown): dishId is number => typeof dishId === 'number' && !isNaN(dishId) && dishId > 0),
      distinctUntilChanged(),
      tap((dishId: number) => this.dishId.set(dishId))
    ).subscribe({
      next: (dishId: number) => this.loadDish(dishId),
      error: (error: unknown) => {
        this.dishId.set(null);
        this.dish.set(null);
      }
    })
  }

  private loadDish(dishId: number): void {
    this.dishId.set(dishId);
    this.loading.set(true);
    this.service.show(dishId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (dish: Dish) => this.dish.set(dish),
      error: (error: HttpErrorResponse) => {
        this.dish.set(null);
        this.notifications.error(parseHttpErrorMessage(error) || $localize`Qualcosa è andato storto.`);
      }
    })
  }

  cancel() {
    this.notifications.error($localize`TODO.`);
  }
}
