import {Injectable} from '@angular/core';
import {ReservationData} from "@core/lib/interfaces/reservation-data";
import {Reservation} from "@core/models/reservation";
import {CommonHttpService} from "@core/services/http/common-http.service";
import {BehaviorSubject, catchError, map, Observable, tap} from "rxjs";
import {DomainService} from "@core/services/domain.service";

@Injectable({
  providedIn: 'root'
})
export class PublicReservationsService extends DomainService {

  constructor() {
    super(`reservations`);
  }

  readonly created: BehaviorSubject<Reservation | null> = new BehaviorSubject<Reservation | null>(null);

  load(secret: string): Observable<Reservation> {
    return this.get<ReservationData>(`${secret}`).pipe(
      map((data: ReservationData): Reservation => new Reservation(data))
    )
  }

  create(params: Record<string, any>): Observable<Reservation> {
    return this.post<ReservationData>(``, params).pipe(
      map((data: ReservationData): Reservation => new Reservation(data)),
      tap(() => this.created.next(null)),
      catchError((error: unknown) => {
        this.created.next(null);

        throw error;
      })
    )
  }
}
