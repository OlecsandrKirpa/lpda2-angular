import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Tag } from '@core/models/tag';
import { ShowImageComponent } from "../../show-image/show-image.component";

@Component({
  selector: 'app-public-menu-show-tags',
  standalone: true,
  imports: [ShowImageComponent],
  templateUrl: './public-menu-show-tags.component.html',
  styleUrl: './public-menu-show-tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicMenuShowTagsComponent {
  @Input({required: true}) tags?: Tag[] | null;
}
