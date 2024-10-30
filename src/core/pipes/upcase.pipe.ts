import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'upcase',
  standalone: true,
  pure: true
})
export class UpcasePipe implements PipeTransform {

  transform(value: unknown): string | null {
    if (!(typeof value == 'string' && value.length > 0)) {
      return null;
    }

    return value.toUpperCase();
  }

}
