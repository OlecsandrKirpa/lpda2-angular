import {Component, Input} from '@angular/core';
import {MenuCategory} from "@core/models/menu-category";

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent {
  @Input({required: true}) category: MenuCategory | null = null;
}
