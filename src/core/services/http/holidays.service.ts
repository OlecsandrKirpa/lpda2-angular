import { Injectable } from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import { Holiday } from '@core/models/holiday';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService extends CommonHttpService<Holiday> {

  constructor() {
    super(Holiday, `admin/holidays`);
  }
}
