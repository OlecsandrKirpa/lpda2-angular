import { Pipe, PipeTransform } from '@angular/core';
import { TuiDay } from '@taiga-ui/cdk';

@Pipe({
  name: 'tuiWeekdayHandler',
  standalone: true,
  pure: true
})
export class TuiWeekdayHandlerPipe implements PipeTransform {

  /**
   * Value must be a number between 0 and 6 where 0 is Sunday and 6 is Saturday
   */
  transform(wday: unknown): (date: TuiDay | undefined) => boolean  {
    return (date: TuiDay | undefined) => date?.dayOfWeek(false) != wday;
  }

}
