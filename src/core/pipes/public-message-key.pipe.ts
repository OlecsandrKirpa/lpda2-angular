import {Pipe, PipeTransform} from '@angular/core';
import {PublicMessage} from "@core/models/public-message";
import {PublicMessages} from "@core/components/public-message/public-message.component";
import {
  isPublicMessageKey,
  PublicMessageLocation,
  PublicMessageLocationExplanation
} from "@core/lib/interfaces/public-message";

@Pipe({
  name: 'publicMessageKey',
  standalone: true
})
export class PublicMessageKeyPipe implements PipeTransform {

  transform(value: unknown): string | null {
    if (!isPublicMessageKey(value)) return null;

    const msg = PublicMessageLocationExplanation[value] ?? ``;
    return `[${value}]: ${msg}`;
  }
}
