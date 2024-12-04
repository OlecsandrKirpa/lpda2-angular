import {inject, Injectable} from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import {Reservation} from "@core/models/reservation";
import {map, Observable} from "rxjs";
import {ReservationTurnData} from "@core/lib/interfaces/reservation-turn-data";
import {ReservationTurn} from "@core/models/reservation-turn";
import {ReservationTableSummary} from "@core/lib/interfaces/reservation-table-summary";
import {PublicReservationsService} from "@core/services/http/public-reservations.service";
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';
import { ReservationTurnMessage } from '@core/models/reservation-turn-message';

@Injectable({
  providedIn: 'root'
})
export class ReservationTurnMessagesService extends CommonHttpService<ReservationTurnMessage> {

  constructor() {
    super(ReservationTurnMessage, `admin/reservation_turn_messages`);
  }

  override create(params: { from_date?: string, to_date?: string, turn_ids?: number[], message?: Record<string, string> }): Observable<ReservationTurnMessage> {
    return super.create(params);
  }

  override update(id: number, params: { from_date?: string, to_date?: string, turn_ids?: number[], message?: Record<string, string> }): Observable<ReservationTurnMessage> {
    return super.update(id, params);
  }
}
