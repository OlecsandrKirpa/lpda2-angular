import { Pipe, PipeTransform } from '@angular/core';
import { TuiDay } from '@taiga-ui/cdk';

@Pipe({
  name: 'dateAfter',
  standalone: true,
  pure: true
})
export class DateAfterPipe implements PipeTransform {

  transform(left: Date | null | undefined, right: Date | null | undefined): boolean {
    if (!left || !right) {
      return false;
    }

    return left.getTime() > right.getTime();
  }

}
