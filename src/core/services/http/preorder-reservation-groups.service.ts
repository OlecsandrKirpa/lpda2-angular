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

@Injectable({
  providedIn: 'root'
})
export class PreorderReservationGroupsService extends CommonHttpService<PreorderReservationGroup> {

  constructor() {
    super(PreorderReservationGroup, `admin/preorder_reservation_groups`);
  }
}
