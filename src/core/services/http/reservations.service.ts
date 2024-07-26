import {inject, Injectable} from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import {Reservation} from "@core/models/reservation";
import {map, Observable} from "rxjs";
import {ReservationTurnData} from "@core/lib/interfaces/reservation-turn-data";
import {ReservationTurn} from "@core/models/reservation-turn";
import {ReservationTableSummary} from "@core/lib/interfaces/reservation-table-summary";
import {PublicReservationsService} from "@core/services/http/public-reservations.service";

@Injectable({
  providedIn: 'root'
})
export class ReservationsService extends CommonHttpService<Reservation> {

  private readonly publicReservations: PublicReservationsService = inject(PublicReservationsService);

  constructor() {
    super(Reservation, `admin/reservations`);
  }

  tablesSummary(params: Record<string, string|number|boolean> = {}): Observable<ReservationTableSummary[]> {
    return this.get<ReservationTableSummary[]>(`tables_summary`, { params });
  }

  readonly getValidTimes = this.publicReservations.getValidTimes;

  deliverConfirmationEmail(id: number): Observable<Reservation> {
    return this.post(`${id}/deliver_confirmation_email`, {}).pipe(
      map((data: unknown) => this.mapItem(data))
    );
  }
}
