import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {NotificationsService} from "@core/services/notifications.service";
import {takeUntil} from "rxjs";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {NgClass} from "@angular/common";
import {Dish} from "@core/models/dish";
import {DishStatusComponent} from "@core/components/statuses/dish/dish-status/dish-status.component";

@Component({
  selector: 'app-edit-dish-status',
  standalone: true,
  imports: [
    TuiHostedDropdownModule,
    TuiDataListModule,
    MatIcon,
    TuiButtonModule,
    NgClass,
    DishStatusComponent
  ],
  templateUrl: './edit-dish-status.component.html',
  providers: [
    TuiDestroyService
  ]
})
export class EditDishStatusComponent {
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly destroy$ = inject(TuiDestroyService);

  @Output() deleteDish: EventEmitter<void> = new EventEmitter<void>();

  // statusChange allows parents to know when to make API request to update value server-side.
  @Output() statusChange: EventEmitter<Dish['status']> = new EventEmitter<Dish['status']>();

  // dishChange is for keeping parent's updated with internal status.
  @Output() dishChange: EventEmitter<Dish> = new EventEmitter<Dish>();
  @Input() dish?: Dish | null = null;

  delete(): void {
    this.notifications.confirm(
      $localize`Sei sicuro di voler eliminare il piatto?`, {
        yes: $localize`Sì, elimina il piatto`,
        no: $localize`Annulla`
      }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result: boolean) => {
        if (result) this.deleteDish.emit();
      }
    })
  }

  updateStatus(status: Dish['status']): void {
    if (this.dish instanceof Dish){
      this.dish.status = status;
      this.dishChange.emit(this.dish);
    }

    this.statusChange.emit(status);
  }
}
