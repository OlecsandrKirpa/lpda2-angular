import { BaseModelData } from "./base-model-data";

export interface HolidayData extends BaseModelData {
  from_timestamp?: string; // datetime;
  to_timestamp?: string; // datetime;
  weekly_from?: string; // time;
  weekly_to?: string; // time;
  weekday?: number;// integer;
  message?: string;

  translations?: {
    message?: Record<string, string>;
  }
}