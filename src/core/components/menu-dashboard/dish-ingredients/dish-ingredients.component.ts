import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Dish} from "@core/models/dish";
import {TuiDestroyService} from "@taiga-ui/cdk";

@Component({
  selector: 'app-dish-ingredients',
  standalone: true,
  imports: [],
  templateUrl: './dish-ingredients.component.html',
  providers: [
    TuiDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DishIngredientsComponent {
  @Output() dishChange: EventEmitter<Dish> = new EventEmitter<Dish>();
  @Input() dish: Dish | null | undefined = null;
}
