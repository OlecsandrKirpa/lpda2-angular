import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum',
  standalone: true,
  pure: true
})
export class SumPipe implements PipeTransform {

  // Expects an array of integers. Returns their sum. null if invalid input.
  transform(value: unknown): number | null {
    if (!(Array.isArray(value) && value.length > 0)) return null;

    return value.filter((v: unknown): v is string | number => typeof v === "number" || typeof v === "string").map((v: string | number): number => typeof v === "string" ? Number(v) : v).reduce((pv: number, cd: number) => pv + cd, 0);
  }

}
