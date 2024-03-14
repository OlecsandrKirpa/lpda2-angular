import { Injectable } from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import {ReservationTurn} from "@core/models/reservation-turn";

@Injectable({
  providedIn: 'root'
})
export class ReservationTurnsService extends CommonHttpService<ReservationTurn> {

  constructor() {
    super(ReservationTurn, `admin/reservation_turns`);
  }
}
