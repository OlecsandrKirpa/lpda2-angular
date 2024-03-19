import { Injectable } from '@angular/core';
import {CommonHttpService} from "@core/services/http/common-http.service";
import {Dish} from "@core/models/dish";

@Injectable({
  providedIn: 'root'
})
export class DishesService extends CommonHttpService<Dish> {

  constructor() {
    super(Dish, `admin/menu/categories`);
  }
}