export const PreferenceKeys = [`language`, `known_languages`, `timezone`] as const;

export type PreferenceKey = typeof PreferenceKeys[number];

export type Preferences = Record<PreferenceKey, PreferenceValue>;

export function isPreferences(v: unknown): v is Preferences {
  if (!(v && typeof v == 'object')) return false;

  Object.keys(v).forEach((key: string): void | false => {
    if (!PreferenceKeys.includes(key as any)) return false;
  });

  return true;
}

export type PreferenceValue = string | number | null | string[] | number[];

export interface Preference {
  key: string,
  value: PreferenceValue,
  user_id: number,
  updated_at: string
}
