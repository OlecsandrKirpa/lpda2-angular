import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectValues',
  standalone: true,
  pure: true
})
export class ObjectValuesPipe implements PipeTransform {

  transform(value: unknown): unknown[] {
    if  (!(typeof value == "object" && value != null && value != undefined)) return [];

    return Object.values(value);
  }

}
