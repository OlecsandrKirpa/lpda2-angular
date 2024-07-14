import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectToArray',
  standalone: true
})
export class ObjectToArrayPipe implements PipeTransform {

  /**
   * For each key in object, return a tuple [key, value].
   */
  transform(value: unknown): [unknown, unknown][] {
    if (value === null || value === undefined) return [];
    if (!(typeof value === "object" && !Array.isArray(value))) return [];

    return Object.keys(value).map((key: string): [string, unknown] => [key, (value as Record<string, unknown>)[key]]);
  }

}
