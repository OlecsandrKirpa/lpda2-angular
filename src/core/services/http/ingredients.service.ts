import { Injectable } from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import {Tag} from "@core/models/tag";
import {Ingredient} from "@core/models/ingredient";

@Injectable({
  providedIn: 'root'
})
export class IngredientsService extends CommonHttpService<Ingredient> {

  constructor() {
    super(Ingredient, `admin/menu/ingredients`);
  }
}
