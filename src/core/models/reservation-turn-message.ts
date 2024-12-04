import { ReservationTurnMessageData } from "@core/lib/interfaces/reservation-turn-message-data";
import { BaseModel } from "../lib/base-model";
import { BaseModelData } from "../lib/interfaces/base-model-data";
import { ReservationTurn } from "./reservation-turn";
import { ReservationTurnData } from "@core/lib/interfaces/reservation-turn-data";

export class ReservationTurnMessage extends BaseModel {
  message: string;
  from_date: string; // Probably YYYY-MM-DD
  to_date: string; // Probably YYYY-MM-DD

  translations?: {
    message?: Record<string, string>;
  }

  turns?: ReservationTurn[];

  constructor(data: ReservationTurnMessageData) {
    super(data);

    this.message = data.message;
    this.from_date = data.from_date;
    this.to_date = data.to_date;
    this.translations = data.translations;
    this.turns = data.turns ? data.turns.map((t: ReservationTurnData) => new ReservationTurn(t)) : [];
  }
}