import { BaseModelData } from "./base-model-data";
import { ReservationTurnData } from "./reservation-turn-data";

export interface ReservationTurnMessageData extends BaseModelData {
  message: string;
  from_date: string; // Probably YYYY-MM-DD
  to_date: string; // Probably YYYY-MM-DD

  translations?: {
    message?: Record<string, string>;
  }

  turns?: ReservationTurnData[];
}