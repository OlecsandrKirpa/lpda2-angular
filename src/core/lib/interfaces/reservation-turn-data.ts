import {BaseModelData} from "@core/lib/interfaces/base-model-data";
import { PreorderReservationGroupData } from "./preorder-reservation-group-data";

export interface ReservationTurnData extends BaseModelData {
  starts_at?: string;
  ends_at?: string;
  name?: string;
  weekday?: 0|1|2|3|4|5|6; // 0 to 6 where 0 is sunday
  step?: number;

  valid_times?: string[];

  preorder_reservation_group?: PreorderReservationGroupData;
}