import {
  ChangeDetectionStrategy,
  Component, computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output, signal, SimpleChanges, WritableSignal
} from '@angular/core';
import {MenuCategory} from "@core/models/menu-category";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {NotificationsService} from "@core/services/notifications.service";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import {DishesService} from "@core/services/http/dishes.service";
import {debounceTime, distinctUntilChanged, filter, finalize, map, Subscription, takeUntil} from "rxjs";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {HttpErrorResponse} from "@angular/common/http";
import {SearchResult} from "@core/lib/search-result.model";
import {Dish} from "@core/models/dish";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiExpandModule, TuiTextfieldControllerModule} from "@taiga-ui/core";

@Component({
  selector: 'app-category-price',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiExpandModule,
    TuiButtonModule
  ],
  templateUrl: './category-price.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class CategoryPriceComponent implements OnInit, OnChanges {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly categoriesService: MenuCategoriesService = inject(MenuCategoriesService);

  readonly removingPrice: WritableSignal<boolean> = signal(false);
  readonly searchingDishes: WritableSignal<boolean> = signal(false);
  readonly savingPrice: WritableSignal<boolean> = signal(false);
  readonly loading = computed(() => this.savingPrice() || this.searchingDishes() || this.removingPrice());

  @Output() categoryChanged: EventEmitter<MenuCategory> = new EventEmitter<MenuCategory>();
  @Input() category: MenuCategory | null | undefined = null;

  readonly price: FormControl<number | null> = new FormControl<number | null>(null);

  ngOnInit(): void {
    this.price.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      filter((price: number | null) => price != this.category?.price),
      debounceTime(1500),
    ).subscribe({
      next: (price: number | null) => this.updateRemote(price)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category']) {
      this.price.patchValue(this.category?.price ?? null);
      // this.searchDishes();
    }
  }

  private updateRemoteSub?: Subscription;

  private updateRemote(newPrice: number | null): void {
    const catId = this.category?.id;
    if (!(catId)) return;

    this.updateRemoteSub?.unsubscribe();

    this.savingPrice.set(true);
    this.updateRemoteSub = this.categoriesService.update(catId, {price: newPrice}).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.savingPrice.set(false))
    ).subscribe({
      next: (c: MenuCategory): void => {
        this.category = c;
        this.categoryChanged.emit(c);
        if (c.price == newPrice) this.notifications.fireSnackBar($localize`Prezzo salvato.`);
        else this.notifications.error($localize`Qualcosa è andato storto nel salvataggio del prezzo.`);
      },
      error: (r: HttpErrorResponse) => {
        this.notifications.fireSnackBar(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto nel salvataggio del prezzo.`);
      }
    })
  }
}
