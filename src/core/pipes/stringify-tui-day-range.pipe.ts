import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';

@Pipe({
  name: 'stringifyTuiDayRange',
  standalone: true,
  pure: true
})
export class StringifyTuiDayRangePipe implements PipeTransform {
  private readonly datePipe = inject(DatePipe);
  private readonly today = TuiDay.currentLocal();

  private readonly singleDateFormat = {
    default: `cccc d MMMM`,
    differentYear: `d MMMM y`
  };

  /**
   * If an antire month is selected, return the month name.
   * If a range of days is selected, return the range of days.
   * If a single day is selected, return the day.
   * If the single day is today, return "Today".
   * If no day is selected, return an empty string.
   * 
   * @param value instance of TuiDayRange
   * @returns human-readable string representation of the TuiDayRange instance
   */
  transform(value: TuiDayRange): string {
    if (!(value instanceof TuiDayRange)) return '';

    const dateFormat: string = value.from.year == value.to.year && value.from.year == this.today.year ? this.singleDateFormat.default : this.singleDateFormat.differentYear;

    if (value.isSingleDay) {
      if (value.from.daySame(this.today)) {
        return $localize`Oggi`;
      }

      return this.datePipe.transform(value.from.toUtcNativeDate(), dateFormat) || '';
    }

    // From and to have same month.
    if (value.from.month == value.to.month) {

      // Entire month selected.
      if (value.from.day == 1 && value.to.daySame(value.from.append({ month: 1 }).append({ day: -1 }))) {
        return this.datePipe.transform(value.from.toUtcNativeDate(), 'MMMM y') || '';
      }

      // Range of days selected.
      return `${value.from.day} - ${value.to.day} ${this.datePipe.transform(value.to.toUtcNativeDate(), 'MMMM') || ''}`;
    }

    const from = this.datePipe.transform(value.from.toLocalNativeDate(), dateFormat) || '';
    const to = this.datePipe.transform(value.to.toLocalNativeDate(), dateFormat) || '';

    return `${from} - ${to}`;
  }
}
