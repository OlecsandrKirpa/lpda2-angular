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

  "new-reservation-form": $localize`The message shown on the new reservation form.`,
  "existing-reservation-form": $localize`The message shown on the existing reservation form.`,
  "openings_monday": $localize`The message shown on the monday openings page.`,
  "openings_tuesday": $localize`The message shown on the tuesday openings page.`,
  "openings_wednesday": $localize`The message shown on the wednesday openings page.`,
  "openings_thursday": $localize`The message shown on the thursday openings page.`,
  "openings_friday": $localize`The message shown on the friday openings page.`,
  "openings_saturday": $localize`The message shown on the saturday openings page.`,
  "openings_sunday": $localize`The message shown on the sunday openings page.`,

  "cancel-reservation": $localize`The message shown on the cancel reservation page.`,
};