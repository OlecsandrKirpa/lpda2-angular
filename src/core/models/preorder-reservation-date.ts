import { BaseModel } from "@core/lib/base-model";
import { PreorderReservationDateData } from "@core/lib/interfaces/preorder-reservation-date-data";
import { ReservationTurn } from "./reservation-turn";
import { ReservationTurnData } from "@core/lib/interfaces/reservation-turn-data";
import { Reservation } from "./reservation";

export class PreorderReservationDate extends BaseModel {
  date?: Date;
  reservation_turn_id?: number;
  group_id?: number;

  reservation_turn?: ReservationTurn;

  constructor(data: PreorderReservationDateData) {
    super(data);

    this.date = data.date ? new Date(data.date) : undefined;
    this.reservation_turn_id = data.reservation_turn_id;
    this.group_id = data.group_id;
    this.reservation_turn = data.reservation_turn ? new ReservationTurn(data.reservation_turn) : undefined;
  }
}