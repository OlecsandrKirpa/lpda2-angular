import { Injectable } from '@angular/core';
import { Dish } from '@core/models/dish';
import { CommonHttpService } from './common-http.service';

@Injectable({
  providedIn: 'root'
})
export class PublicMenuDishesService extends CommonHttpService<Dish> {

  constructor() {
    super(Dish, `menu/dishes`);
  }
}