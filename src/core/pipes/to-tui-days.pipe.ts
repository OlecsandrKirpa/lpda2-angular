import { Pipe, PipeTransform } from '@angular/core';
import { TuiDay } from '@taiga-ui/cdk';

@Pipe({
  name: 'toTuiDays',
  standalone: true,
  pure: true
})
export class ToTuiDaysPipe implements PipeTransform {

  /**
   * Input should be array of dates.
   */
  transform(value: unknown): TuiDay[] | null {
    if (!Array.isArray(value)) return null;

    return value.filter(v => v instanceof Date).map(v => TuiDay.fromLocalNativeDate(v));
  }

}
