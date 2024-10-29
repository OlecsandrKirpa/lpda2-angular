import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { TuiDayRange } from '@taiga-ui/cdk';

@Pipe({
  name: 'datePeriodSummary',
  pure: true,
  standalone: true,
})
export class DatePeriodSummaryPipe implements PipeTransform {

  private readonly datePipe = inject(DatePipe);

  transform(value: unknown, format?: string): string | null {
    if (!(value instanceof TuiDayRange)) return null;

    const fromStr = this.datePipe.transform(value.from.toUtcNativeDate(), format);
    const toStr = this.datePipe.transform(value.to.toUtcNativeDate(), format);
    return `Dal ${fromStr} al ${toStr}`;
  }

}
