import {TuiDay, TuiTime, TuiTimeMode} from "@taiga-ui/cdk";

/**
 * Will convert TuiDay and TuiTime to ISO string in UTC.
 */
export function tuiDatetimeToIsoString(day: TuiDay, time: TuiTime): string {
  const currentTimezoneDate: Date = new Date(`${day.formattedYear}-${day.formattedMonthPart}-${day.formattedDayPart} ${time.toString()}`);
  return currentTimezoneDate.toISOString();
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