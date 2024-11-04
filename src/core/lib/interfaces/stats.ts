import { fromUtcTimeDateToLocal } from "../tui-datetime-to-iso-string";

export interface StatsParams {
  reservations_date_from?: string;
  reservations_date_to?: string;
  keys?: StatsKeys | StatsKeys[];
}

export const StatsKeys = [
  "reservations-by-hour"
] as const;

export type StatsKeys = typeof StatsKeys[number];

/**
 * /v1/admin/stats returns response of this kind:
 */
export interface Stats {
  /**
   * Key is the UCT datetime string in the format of `YYYY-MM-DD HH:mm`.
   * Value is the sum of the people that made a reservation in that hour.
   */
  ["reservations-by-hour"]: Record<string, number>;
}

export function isStatsReservationsByHour(arg: unknown): arg is Stats["reservations-by-hour"] {
  return (
    typeof arg === 'object' && arg !== null &&
    Object.keys(arg).every((key) => typeof key === 'string' && typeof (arg as Record<string, unknown>)[key] === 'number')
  )
}

export function isStats(arg: unknown): arg is Stats {
  return (
    typeof arg === 'object' && arg !== null &&
    isStatsReservationsByHour((arg as Record<string, unknown>)["reservations-by-hour"])
  )
}

/**
 * Whenever founds dates or times, will localize them to the user's locale.
 */
export function localizeStats(stats: Partial<Stats>): Partial<Stats> {
  const localizedStats: Partial<Stats> = {...stats};

  if (localizedStats["reservations-by-hour"] && stats["reservations-by-hour"]) {
    localizedStats["reservations-by-hour"] = {};
    for (const [key, value] of Object.entries(stats["reservations-by-hour"])) {
      localizedStats["reservations-by-hour"][fromUtcTimeDateToLocal(key)] = value;
    }
  }

  return localizedStats;
}