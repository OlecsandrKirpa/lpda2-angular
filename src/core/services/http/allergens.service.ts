import { Injectable } from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";

@Injectable({
  providedIn: 'root'
})
export class AllergensService extends CommonHttpService<Allergen> {

  constructor() {
    super(Allergen, `admin/menu/allergens`);
  }
}
