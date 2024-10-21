import { BaseModelData } from "./base-model-data";
import { ReservationTurnData } from "./reservation-turn-data";

export interface PreorderReservationDateData extends BaseModelData {
  date?: Date;
  reservation_turn_id?: number;
  group_id?: number;


  reservation_turn?: ReservationTurnData;
}