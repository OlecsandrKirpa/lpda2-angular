import {BaseModel} from "@core/lib/base-model";
import {ReservationTurnData} from "@core/lib/interfaces/reservation-turn-data";

export class ReservationTurn extends BaseModel {
  starts_at?: string;
  ends_at?: string;
  name?: string;
  weekday?: number; // 0 to 6 where 0 is sunday
  step?: number;

  valid_times?: string[];

  constructor(data: ReservationTurnData) {
    super(data);

    this.starts_at = data.starts_at;
    this.ends_at = data.ends_at;
    this.name = data.name;
    this.weekday = data.weekday;
    this.step = data.step;

    this.valid_times = data.valid_times;
  }
}