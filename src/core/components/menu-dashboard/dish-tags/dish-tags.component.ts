import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {Dish} from "@core/models/dish";

@Component({
  selector: 'app-dish-tags',
  standalone: true,
  imports: [],
  templateUrl: './dish-tags.component.html',
  providers: [
    TuiDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DishTagsComponent {
  @Output() dishChange: EventEmitter<Dish> = new EventEmitter<Dish>();
  @Input() dish: Dish | null | undefined = null;
}
