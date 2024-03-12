import {BaseModelData} from "@core/lib/interfaces/base-model-data";

export interface ReservationTurnData extends BaseModelData {
  starts_at?: string;
  ends_at?: string;
  name?: string;
  weekday?: number; // 0 to 6 where 0 is sunday
  step?: number;

  valid_times?: string[];
}