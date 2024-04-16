import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input, OnChanges, OnInit,
  Output,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core';
import {Dish} from "@core/models/dish";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {NotificationsService} from "@core/services/notifications.service";
import {DishesService} from "@core/services/http/dishes.service";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, filter, finalize, Subscription, takeUntil} from "rxjs";
import {MenuCategory} from "@core/models/menu-category";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SearchResult} from "@core/lib/search-result.model";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiExpandModule, TuiTextfieldControllerModule} from "@taiga-ui/core";

@Component({
  selector: 'app-dish-price',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiExpandModule,
    TuiButtonModule
  ],
  templateUrl: './dish-price.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class DishPriceComponent implements OnInit, OnChanges {

  @Output() dishChanged: EventEmitter<Dish> = new EventEmitter<Dish>();
  @Input() dish: Dish | null | undefined = null;

  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly dishesService: DishesService = inject(DishesService);

  readonly removingPrice: WritableSignal<boolean> = signal(false);
  readonly searchingDishes: WritableSignal<boolean> = signal(false);
  readonly savingPrice: WritableSignal<boolean> = signal(false);
  readonly loading = computed(() => this.savingPrice() || this.searchingDishes() || this.removingPrice());

  readonly price: FormControl<number | null> = new FormControl<number | null>(null);

  ngOnInit(): void {
    this.price.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      filter((price: number | null) => price != this.dish?.price),
      debounceTime(1500),
    ).subscribe({
      next: (price: number | null) => this.updateRemote(price)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dish']) this.price.patchValue(this.dish?.price ?? null);
  }

  private updateRemoteSub?: Subscription;

  private updateRemote(newPrice: number | null): void {
    const dishId = this.dish?.id;
    if (!(dishId)) return;

    this.updateRemoteSub?.unsubscribe();

    this.savingPrice.set(true);
    this.updateRemoteSub = this.dishesService.update(dishId, {price: newPrice}).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.savingPrice.set(false))
    ).subscribe({
      next: (c: Dish): void => {
        this.dish = c;
        this.dishChanged.emit(c);
        this.notifications.fireSnackBar($localize`Prezzo salvato.`);
      },
      error: (r: HttpErrorResponse) => {
        this.notifications.fireSnackBar(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto nel salvataggio del prezzo.`);
      }
    })
  }
}
