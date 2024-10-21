import { Pipe, PipeTransform } from '@angular/core';
import { TuiDay } from '@taiga-ui/cdk';

@Pipe({
  name: 'fromTuiDay',
  standalone: true,
  pure: true
})
export class FromTuiDayPipe implements PipeTransform {

  // Input should be a TuiDay
  transform(value: unknown): Date | null {
    if (value instanceof Date) return value;
    if (value instanceof TuiDay) return value.toUtcNativeDate();

    return null;
  }

}
