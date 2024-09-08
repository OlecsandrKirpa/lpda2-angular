import {BaseModelData} from "@core/lib/interfaces/base-model-data";

export interface PublicMessageData extends BaseModelData {
  key?: PublicMessageKey;
  text?: string;

  translations?: {
    text?: Record<string, string>;
  }
}

export const PublicMessageLocations = [
  "home-landing",
  "home-about",
  "home-menu",
  "home-instagram",
  "home-reserve",
  "new-reservation-form",
  "existing-reservation-form",
  "openings_monday",
  "openings_tuesday",
  "openings_wednesday",
  "openings_thursday",
  "openings_friday",
  "openings_saturday",
  "openings_sunday",
  "cancel-reservation"
] as const;

export type PublicMessageLocation = typeof PublicMessageLocations[number];

export type PublicMessageKey = PublicMessageLocation;

export function isPublicMessageKey(key: unknown): key is PublicMessageKey {
  return typeof key === "string" && key.length > 0 && PublicMessageLocations.includes(key as PublicMessageKey);
}

export const PublicMessageLocationExplanation: Record<PublicMessageLocation, string> = {
  "home-landing": $localize`Pagina principale, subito dopo la prima sezione`,
  "home-about": $localize`Pagina principale, subito dopo la sezione 'chi siamo'.`,
  "home-menu": $localize`Pagina principale, subito dopo la sezione 'menu'.`,
  "home-instagram": $localize`Pagina principale, subito dopo la sezione instagram.`,
  "home-reserve": $localize`Pagina principale, interno alla sezione prenotazione.`,

  "new-reservation-form": $localize`Form di prenotazione pubblica.`,
  "existing-reservation-form": $localize`Pagina prenotazione esistente.`,
  "openings_monday": $localize`Orari di apertura per lunedì.`,
  "openings_tuesday": $localize`Orari di apertura per martedì.`,
  "openings_wednesday": $localize`Orari di apertura per mercoledì.`,
  "openings_thursday": $localize`Orari di apertura per giovedì.`,
  "openings_friday": $localize`Orari di apertura per venerdì.`,
  "openings_saturday": $localize`Orari di apertura per sabato.`,
  "openings_sunday": $localize`Orari di apertura per domenica.`,

  "cancel-reservation": $localize`Messaggio mostrato a chi volesse annullare la prenotazione.`,
};