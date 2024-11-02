import { Pipe, PipeTransform } from '@angular/core';
import { ContactKey, isContactKey } from '@core/lib/interfaces/contact';

@Pipe({
  name: 'humanizeContactKey',
  standalone: true,
  pure: true
})
export class HumanizeContactKeyPipe implements PipeTransform {

  readonly mapping: Partial<Record<ContactKey, string>> = {
    address: $localize`Indirizzo del ristorante.`,
    email: $localize`Indirizzo email`,
    facebook_url: $localize`URL alla pagina Facebook del ristorante`,
    google_url: $localize`URL alla pagina google maps del ristorante`,
    homepage_url: $localize`Link alla home di questo sito`,
    instagram_url: $localize`Link alla pagina instagram del ristorante`,
    phone: $localize`Numero di telefono con prefisso internazionale`,
    tripadvisor_url: $localize`Link alla pagina tripadvisor`,
    whatsapp_number: $localize`Numero di telefono abilitato a whatsapp.`
  };

  /**
   * value should be a ContactKey
   */
  transform(value: unknown): string | null {
    if (!isContactKey(value)){
      return null;
    }

    return this.mapping[value] ?? null;
  }

}
