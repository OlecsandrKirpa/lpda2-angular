import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekday',
  standalone: true,
  pure: true
})
export class WeekdayPipe implements PipeTransform {

  private readonly weekdays = [
    $localize`Domenica`,
    $localize`Lunedì`, 
    $localize`Martedì`,
    $localize`Mercoledì`,
    $localize`Giovedì`,
    $localize`Venerdì`,
    $localize`Sabato`
  ];

  /**
   * Input is expected to be a number representing a weekday, where 0 is Sunday and 6 is Saturday.
   */
  transform(value: unknown): string | null {
    if (typeof value !== 'number' && typeof value === 'string') value = parseInt(value);

    if (!(typeof value === 'number' && value >= 0 && value <= 6)) return null;

    return this.weekdays[value];
  }

}
