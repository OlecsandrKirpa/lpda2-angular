import { Injectable } from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import { Holiday } from '@core/models/holiday';
import { fromUtcTimeToLocal } from '@core/lib/tui-datetime-to-iso-string';
import { SearchResult } from '@core/lib/search-result.model';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService extends CommonHttpService<Holiday> {

  constructor() {
    super(Holiday, `admin/holidays`);
  }

  // protected override mapItem(data: unknown): Holiday {
  //   const h = super.mapItem(data);

  //   /**
  //    * TODO what if by applying local time we get a different day?
  //    */
  //   if (h.weekly_from) h.weekly_from = fromUtcTimeToLocal(h.weekly_from);
  //   if (h.weekly_to) h.weekly_to = fromUtcTimeToLocal(h.weekly_to);

  //   return h;
  // }

  // protected override mapItems(data: unknown): SearchResult<Holiday> {
  //   const result = super.mapItems(data);

  //   result.items.forEach((h: Holiday) => {
  //     if (h.weekly_from) h.weekly_from = fromUtcTimeToLocal(h.weekly_from);
  //     if (h.weekly_to) h.weekly_to = fromUtcTimeToLocal(h.weekly_to);
  //   })

  //   return result;
  // }
}
