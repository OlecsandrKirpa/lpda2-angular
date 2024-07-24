import {inject, Injectable} from '@angular/core';
import {ReservationData} from "@core/lib/interfaces/reservation-data";
import {Reservation} from "@core/models/reservation";
import {CommonHttpService} from "@core/services/http/common-http.service";
import {BehaviorSubject, catchError, map, Observable, tap} from "rxjs";
import {DomainService} from "@core/services/domain.service";
import {PublicPagesDataService} from "@core/services/http/public-pages-data.service";

@Injectable({
  providedIn: 'root'
})
export class PublicReservationsService extends DomainService {

  private readonly publicData: PublicPagesDataService = inject(PublicPagesDataService);

  constructor() {
    super(`reservations`);

    this.publicData.data$.subscribe({
      next: (data): void => {
        this.created.next(data?.reservation ? new Reservation(data.reservation) : null);
      }
    });
  }

  readonly created: BehaviorSubject<Reservation | null> = new BehaviorSubject<Reservation | null>(null);

  load(secret: string): Observable<Reservation> {
    return this.get<ReservationData>(`${secret}`).pipe(
      map((data: ReservationData): Reservation => new Reservation(data))
    )
  }

  create(params: Record<string, any>): Observable<Reservation> {
    return this.post<{ item: ReservationData }>(``, params).pipe(
      map((data: { item: ReservationData }): Reservation => new Reservation(data.item)),
      tap((r: Reservation) => this.created.next(r)),
      catchError((error: unknown) => {
        this.created.next(null);

        throw error;
      })
    )
  }

  resendConfirmation(secret: string): Observable<unknown> {
    return this.post<unknown>(`${secret}/resend_confirmation_email`, {});
  }
}
