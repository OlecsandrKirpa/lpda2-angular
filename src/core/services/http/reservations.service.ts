import {Injectable} from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import {Reservation} from "@core/models/reservation";
import {map, Observable} from "rxjs";
import {ReservationTurnData} from "@core/lib/interfaces/reservation-turn-data";
import {ReservationTurn} from "@core/models/reservation-turn";
import {ReservationTableSummary} from "@core/lib/interfaces/reservation-table-summary";

@Injectable({
  providedIn: 'root'
})
export class ReservationsService extends CommonHttpService<Reservation> {

  constructor() {
    super(Reservation, `admin/reservations`);
  }

  tablesSummary(params: Record<string, string|number|boolean> = {}): Observable<ReservationTableSummary[]> {
    return this.get<ReservationTableSummary[]>(`tables_summary`, { params });
  }

  getValidTimes(date: Date): Observable<ReservationTurn[]> {
    return this.get<ReservationTurnData[]>(`valid_times`, {params: {date: date.toISOString()}}).pipe(
      map((data: ReservationTurnData[]): ReservationTurn[] => data.map((d: ReservationTurnData): ReservationTurn => new ReservationTurn(d))),
    )
  }

  deliverConfirmationEmail(id: number): Observable<Reservation> {
    return this.post(`${id}/deliver_confirmation_email`, {}).pipe(
      map((data: unknown) => this.mapItem(data))
    );
  }
}
