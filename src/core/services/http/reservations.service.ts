import {Injectable} from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import {Reservation} from "@core/models/reservation";
import {map, Observable} from "rxjs";
import {ReservationTurnData} from "@core/lib/interfaces/reservation-turn-data";
import {ReservationTurn} from "@core/models/reservation-turn";

@Injectable({
  providedIn: 'root'
})
export class ReservationsService extends CommonHttpService<Reservation> {

  constructor() {
    super(Reservation, `admin/reservations`);
  }

  // search(params: Record<string, string | number>): Observable<SearchResult<T>> {
  //   return this.get(``, {params: params}).pipe(
  //     map((data: any): SearchResult<T> => this.mapItems(data)),
  //   );
  // }

  getValidTimes(date: Date): Observable<ReservationTurn[]> {
    return this.get<ReservationTurnData[]>(`valid_times`, {params: {date: date.toISOString()}}).pipe(
      map((data: ReservationTurnData[]): ReservationTurn[] => data.map((d: ReservationTurnData): ReservationTurn => new ReservationTurn(d))),
    )
  }
}
