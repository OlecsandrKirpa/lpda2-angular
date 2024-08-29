import { Injectable } from '@angular/core';
import { Allergen } from '@core/models/allergen';
import { CommonHttpService } from './common-http.service';

@Injectable({
  providedIn: 'root'
})
export class PublicMenuAllergensService extends CommonHttpService<Allergen> {

  constructor() {
    super(Allergen, `menu/allergens`);
  }
}