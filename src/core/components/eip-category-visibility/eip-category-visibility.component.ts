import {Component, Input} from '@angular/core';
import {MenuCategory} from "@core/models/menu-category";

@Component({
  selector: 'app-eip-category-visibility',
  standalone: true,
  imports: [],
  templateUrl: './eip-category-visibility.component.html',
  styleUrl: './eip-category-visibility.component.scss'
})
export class EipCategoryVisibilityComponent {
  @Input({required: true}) category?: MenuCategory | null;
}
