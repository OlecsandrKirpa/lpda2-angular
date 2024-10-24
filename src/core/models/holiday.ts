import { BaseModel } from "@core/lib/base-model";
import { HolidayData } from "@core/lib/interfaces/holiday-data";

export class Holiday extends BaseModel {
  static wholeDay(data: { weekly_from: unknown, weekly_to: unknown }): boolean {
    return data.weekly_from === "00:00" && data.weekly_to === "23:59";
  }

  from_timestamp?: Date; // datetime;
  to_timestamp?: Date; // datetime;
  weekly_from?: string; // time HH:MM;
  weekly_to?: string; // time HH:MM;
  weekday?: number;// integer where 0 is Sunday, 1 is Monday, etc.

  // Translated message: {language: message}
  message?: string;

  translations: {
    message?: Record<string, string>;
  }

  isWeekly: boolean = false;
  isWholeDay: boolean = false;

  constructor(data: HolidayData) {
    super(data);

    this.from_timestamp = data.from_timestamp ? new Date(data.from_timestamp) : undefined;
    this.to_timestamp = data.to_timestamp ? new Date(data.to_timestamp) : undefined;
    this.weekly_from = data.weekly_from;
    this.weekly_to = data.weekly_to;
    this.weekday = data.weekday;
    this.message = data.message;
    this.translations = {...(data.translations ?? {})};

    this.isWeekly = this.calcIsWeekly();
    this.isWholeDay = this.calcIsWholeday();
  }

  calcIsWeekly(): boolean {
    return (
      (typeof this.weekly_from == "string" && this.weekly_from.length > 0) ||
      (typeof this.weekly_to == "string" && this.weekly_to.length > 0));
  }

  calcIsWholeday(): boolean {
    return Holiday.wholeDay({weekly_from: this.weekly_from, weekly_to: this.weekly_to});
    // return this.weekly_from === "00:00" && this.weekly_to === "23:59";
  }
}