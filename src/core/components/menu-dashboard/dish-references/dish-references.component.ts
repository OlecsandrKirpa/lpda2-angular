import {ChangeDetectionStrategy, Component, inject, Input, signal, WritableSignal} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {Dish} from "@core/models/dish";
import {DishesService} from "@core/services/http/dishes.service";
import {DishReferences} from "@core/lib/interfaces/dish-references";
import {finalize, takeUntil} from "rxjs";
import {NotificationsService} from "@core/services/notifications.service";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {HttpErrorResponse} from "@angular/common/http";
import {UrlToPipe} from "@core/pipes/url-to.pipe";
import {RouterLink} from "@angular/router";
import {TuiLinkModule} from "@taiga-ui/core";

@Component({
  selector: 'app-dish-references',
  standalone: true,
  imports: [
    UrlToPipe,
    RouterLink,
    TuiLinkModule
  ],
  templateUrl: './dish-references.component.html',
  styleUrl: './dish-references.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class DishReferencesComponent {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly service: DishesService = inject(DishesService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  @Input({required: true}) set dish(dish: Dish | null | undefined) {
    this.item.set(dish ?? null);
    this.searchReferences();
  }

  readonly item: WritableSignal<Dish | null> = signal(null);
  readonly references: WritableSignal<DishReferences | null> = signal(null);
  readonly searching: WritableSignal<boolean> = signal(false);

  private searchReferences(): void {
    this.references.set(null);

    const itemId = this.item()?.id;
    if (!itemId) return;

    this.searching.set(true);
    this.service.references(itemId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.searching.set(false)),
    ).subscribe({
      next: (references: DishReferences) => this.references.set(references),
      error: (error: HttpErrorResponse) => this.notifications.error(parseHttpErrorMessage(error) || $localize`Qualcosa è andato storto.`)
    });
  }
}
