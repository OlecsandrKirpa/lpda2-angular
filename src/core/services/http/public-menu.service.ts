import { inject, Injectable } from '@angular/core';
import { PublicMenuCategoriesService } from './public-menu-categories.service';
import { PublicMenuAllergensService } from './public-menu-allergens.service';
import { PublicMenuDishesService } from './public-menu-dishes.service';
import { PublicMenuIngredientsService } from './public-menu-ingredients.service';

@Injectable({
  providedIn: 'root'
})
export class PublicMenuService {
  readonly allergens: PublicMenuAllergensService = inject(PublicMenuAllergensService);
  readonly categories: PublicMenuCategoriesService = inject(PublicMenuCategoriesService);
  readonly dishes: PublicMenuDishesService = inject(PublicMenuDishesService);
  readonly ingredients: PublicMenuIngredientsService = inject(PublicMenuIngredientsService);

  searchAllergens = this.allergens.search.bind(this.allergens);
  searchCategories = this.categories.search.bind(this.categories);
  searchDishes = this.dishes.search.bind(this.dishes);
  searchIngredients = this.ingredients.search.bind(this.ingredients);

  showAllergen = this.allergens.show.bind(this.allergens);
  showCategory = this.categories.show.bind(this.categories);
  showDish = this.dishes.show.bind(this.dishes);
  showIngredient = this.ingredients.show.bind(this.ingredients);
}
