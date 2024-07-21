import {TuiDay, TuiTime, TuiTimeMode} from "@taiga-ui/cdk";

export const isoTimezoneRexExp: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

/**
 * Will convert TuiDay and TuiTime to ISO string in UTC.
 */
export function tuiDatetimeToIsoString(day: TuiDay, time: TuiTime): string {
  const currentTimezoneDate: Date = new Date(`${day.formattedYear}-${day.formattedMonthPart}-${day.formattedDayPart} ${time.toString()}`);
  return currentTimezoneDate.toISOString();
}

/**
 * Reverse of tuiDatetimeToIsoString.
 * @param isoString
 */
export function isoStringToTuiDay(isoString: unknown): TuiDay | null {
  if (!(typeof isoString == 'string' && isoString.length > 0 && isoString.match(isoTimezoneRexExp))) {
    console.error(`Invalid string provided to isoStringToTuiDay`, {isoString});
    return null;
  }

  const date: Date = new Date(isoString);
  return new TuiDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/**
 * Reverse of tuiDatetimeToIsoString.
 * @param isoString
 */
export function isoStringToTuiTime(isoString: unknown): TuiTime | null {
  if (!(typeof isoString == 'string' && isoString.length > 0 && isoString.match(isoTimezoneRexExp))) {
    console.error(`Invalid string provided to isoStringToTuiTime`, {isoString});
    return null;
  }

  const date: Date = new Date(isoString);
  return new TuiTime(date.getHours(), date.getMinutes());
}

/**
 * Will convert TuiDay to string in format 'YYYY-MM-DD'.
 * @param day
 */
export function tuiDayToString(day: TuiDay): string {
  return `${day.formattedYear}-${day.formattedMonthPart}-${day.formattedDayPart}`;
}

/**
 * Will convert TuiTime to string.
 * @param time - TuiTime object.
 * @param mode - format of time. Default 'HH:MM'.
 */
export function tuiTimeToString(time: TuiTime, mode: TuiTimeMode = "HH:MM"): string {
  return time.toString(mode);
}

export function tuiTimeToIsoString(time: TuiTime): string {
  return new Date(`1970-01-01 ${time.toString()}`).toISOString();
}

export function dateToTuiDay(date: Date): TuiDay {
  return new TuiDay(date.getFullYear(), date.getMonth() /* + 1 */, date.getDate());
}

export function dateToTuiTime(date: Date): TuiTime {
  return new TuiTime(date.getHours(), date.getMinutes());
}