import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'downcase',
  standalone: true,
  pure: true
})
export class DowncasePipe implements PipeTransform {

  transform(value: unknown): string | null {
    if (!(typeof value == 'string' && value.length > 0)) {
      return null;
    }

    return value.toLowerCase();
  }

}
