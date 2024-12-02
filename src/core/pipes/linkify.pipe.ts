import { Pipe, PipeTransform } from '@angular/core';
import * as linkify from 'linkifyjs';

@Pipe({
  name: 'linkify',
  standalone: true,
  pure: true
})
export class LinkifyPipe implements PipeTransform {

  transform(str: string | null | undefined): string | null | undefined {
    if (!str) return str;

    const tokens = linkify.find(str);
    if (!tokens) return str;

    let result = str;
    for (const token of tokens) {
      if (token.type === `url`) {
        result = result.replace(token.value, `<a href="${token.href}" target="_blank">${token.value}</a>`);
      }
    }

    return result;
  }
}
