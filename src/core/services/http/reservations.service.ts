import { Injectable } from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import {Reservation} from "@core/models/reservation";

@Injectable({
  providedIn: 'root'
})
export class ReservationsService extends CommonHttpService<Reservation> {

  constructor() {
    super(Reservation, `admin/reservations`);
  }
}
