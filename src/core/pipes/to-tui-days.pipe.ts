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
    const result: TuiDay[] = [];
    for (const v of value) {
      if (v instanceof Date) {
        result.push(TuiDay.fromUtcNativeDate(v));
      } else if (v instanceof TuiDay) {
        result.push(v);
      } else {
        console.warn('Invalid date', v);
      }
    }

    return result;
  }

}
