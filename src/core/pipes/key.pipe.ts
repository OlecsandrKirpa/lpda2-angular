import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'key',
  standalone: true
})
export class KeyPipe implements PipeTransform {

  transform<T extends string>(value: null | undefined | Record<T, unknown>, keyName: T): null | unknown {
    if (typeof value !== "object" || value === null) return null;

    return value[keyName];
  }

}
