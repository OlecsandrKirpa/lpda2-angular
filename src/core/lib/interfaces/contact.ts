export const ContactKeys = [
  `address`,
  `email`,
  `phone`,
  `whatsapp_number`,
  `facebook_url`,
  `instagram_url`,
  `tripadvisor_url`,
  `homepage_url`,
  `google_url`,
] as const;

export const ContactKeysArray: string[] = [...ContactKeys];

export type ContactKey = typeof ContactKeys[number];

export type Contacts = Record<ContactKey, ContactValue>;

export function isContactKey(v: unknown): v is ContactKey {
  return typeof v === "string" && ContactKeysArray.includes(v);
}
 
export function isContacts(v: unknown): v is Contacts {
  if (!(v && typeof v == 'object')) return false;

  return Object.keys(v).every((key: unknown): boolean => isContactKey(key));
}

export type ContactValue = string;

export interface Contact {
  key: string,
  value: ContactValue,
  updated_at: string
}
