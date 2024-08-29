import { Injectable } from '@angular/core';
import { Ingredient } from '@core/models/ingredient';
import { CommonHttpService } from './common-http.service';

@Injectable({
  providedIn: 'root'
})
export class PublicMenuIngredientsService extends CommonHttpService<Ingredient> {

  constructor() {
    super(Ingredient, `menu/ingredients`);
  }
}
