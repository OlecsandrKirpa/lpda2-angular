import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Allergen } from '@core/models/allergen';
import { ShowImageComponent } from "../../show-image/show-image.component";

@Component({
  selector: 'app-public-menu-show-allergens',
  standalone: true,
  imports: [ShowImageComponent],
  templateUrl: './public-menu-show-allergens.component.html',
  styleUrl: './public-menu-show-allergens.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicMenuShowAllergensComponent {
  @Input({required: true}) allergens?: Allergen[] | null;
}
