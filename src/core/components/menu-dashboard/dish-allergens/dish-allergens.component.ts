import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {Dish} from "@core/models/dish";

@Component({
  selector: 'app-dish-allergens',
  standalone: true,
  imports: [],
  templateUrl: './dish-allergens.component.html',
  providers: [
    TuiDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DishAllergensComponent {
  @Output() dishChange: EventEmitter<Dish> = new EventEmitter<Dish>();
  @Input() dish: Dish | null | undefined = null;
}
