import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true,
  pure: true
})
export class CapitalizePipe implements PipeTransform {

  transform(value: unknown): string | null {
    if (!(typeof value == 'string' && value.length > 0)) {
      return null;
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
