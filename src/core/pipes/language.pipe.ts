import { Pipe, PipeTransform } from '@angular/core';

const languages: Record<string, string> = {
  it: $localize`Italiano`,
  en: $localize`English`,
  fr: $localize`French`,
  de: $localize`German`,
  es: $localize`Spanish`,
  pt: $localize`Portuguese`,
  ru: $localize`Russian`,
  zh: $localize`Chinese`,
}

@Pipe({
  name: 'language',
  standalone: true
})
export class LanguagePipe implements PipeTransform {

  transform(value: unknown): string {
    if (typeof value == "string" && value.length > 0) {
      return languages[value] ?? value;
    }

    return $localize`unknown`;
  }

}
