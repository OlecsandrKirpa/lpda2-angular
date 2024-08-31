import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Dish } from '@core/models/dish';
import { ShowImageComponent } from "../../show-image/show-image.component";

@Component({
  selector: 'app-public-menu-show-suggestions',
  standalone: true,
  imports: [ShowImageComponent],
  templateUrl: './public-menu-show-suggestions.component.html',
  styleUrl: './public-menu-show-suggestions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicMenuShowSuggestionsComponent {
  @Input({required: true}) dishes?: Dish[] | null;
}
