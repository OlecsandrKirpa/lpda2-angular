
export const offsetHours: number = ((new Date()).getTimezoneOffset() / 60);

/**
 * Given a string like
 * "HH:mm" in UTC,
 * will convert in current timezone string
 */
export function strTimeTimezone(string: unknown, offset: number = offsetHours): string {
  if (!(typeof string == 'string' && string.length > 0 && string.match(/\d{1,2}:\d{1,2}/))) {
    console.error(`Invalid string provided to strTimeTimezone`, {string});
    return ``;
  }

  const startsAtHours: number = Number(string.split(`:`)[0]);
  return `${startsAtHours - offset}:${string.split(`:`)[1]}`;
}

/**
 * From current timezone to UTC (reverse of strTimeTimezone)
 * format input and output: "HH:mm"
 */
export function strToUTC(string: string, offset: number = offsetHours): string {
  return strTimeTimezone(string, -1 * offset);
}