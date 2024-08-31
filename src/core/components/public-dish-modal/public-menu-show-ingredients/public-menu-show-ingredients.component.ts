import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ShowImageComponent } from '@core/components/show-image/show-image.component';
import { Ingredient } from '@core/models/ingredient';

@Component({
  selector: 'app-public-menu-show-ingredients',
  standalone: true,
  imports: [ShowImageComponent],
  templateUrl: './public-menu-show-ingredients.component.html',
  styleUrl: './public-menu-show-ingredients.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicMenuShowIngredientsComponent {
  @Input({required: true}) ingredients?: Ingredient[] | null;
}
