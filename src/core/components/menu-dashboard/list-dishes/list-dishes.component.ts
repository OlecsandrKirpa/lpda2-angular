import {Component, computed, signal, WritableSignal} from '@angular/core';
import {TuiButtonModule, TuiHostedDropdownModule, TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {Dish} from "@core/models/dish";
import {SearchResult} from "@core/lib/search-result.model";

@Component({
  selector: 'app-list-dishes',
  standalone: true,
  imports: [
    TuiLinkModule,
    MatIcon,
    RouterLink,
    TuiHostedDropdownModule,
    TuiButtonModule
  ],
  templateUrl: './list-dishes.component.html',
  styleUrl: './list-dishes.component.scss'
})
export class ListDishesComponent {
  readonly data: WritableSignal<SearchResult<Dish> | null> = signal(null);
  readonly items = computed(() => this.data()?.items ?? []);
}
