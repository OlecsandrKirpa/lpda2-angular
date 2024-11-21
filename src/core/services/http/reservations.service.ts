import {inject, Injectable} from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import {Reservation} from "@core/models/reservation";
import {catchError, map, Observable, Observer} from "rxjs";
import {ReservationTurnData} from "@core/lib/interfaces/reservation-turn-data";
import {ReservationTurn} from "@core/models/reservation-turn";
import {ReservationTableSummary} from "@core/lib/interfaces/reservation-table-summary";
import {PublicReservationsService} from "@core/services/http/public-reservations.service";
import { HttpResponse } from '@angular/common/http';
import { exportFilenameFromContentDisposition } from '@core/lib/export-filename-from-content-disposition';

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

  deliverConfirmationEmail(id: number): Observable<Reservation> {
    return this.post(`${id}/deliver_confirmation_email`, {}).pipe(
      map((data: unknown) => this.mapItem(data))
    );
  }

  refoundPayment(id: number): Observable<Reservation> {
    return this.post(`${id}/refund_payment`, {}).pipe(
      map((data: unknown) => this.mapItem(data))
    )
  }

  refreshPaymentStatus(id: number): Observable<Reservation> {
    return this.post(`${id}/refresh_payment_status`, {}).pipe(
      map((data: unknown) => this.mapItem(data))
    );
  }

  export(params: Record<string, string | number | boolean>): Observable<void> {
    return new Observable<void>((observer: Observer<void>): void => {
      this.get(`export`, {
        responseType: "blob",
        observe: "response",
        params: params,
      }).pipe(
        catchError((error: any): Observable<never> => {
          console.error(`ReservationsService.export() error:`, error);
          observer.error(error);
          return new Observable<never>();
        }),
      ).subscribe(
        (response: unknown): void => {

          if (response instanceof HttpResponse && response.body) {
            const filename: string = exportFilenameFromContentDisposition(response.headers?.get(`Content-Disposition`)) ?? `Prenotazioni.xlsx`;
            const contentType: string = response.headers?.get(`Content-Type`) ?? `application/octet-stream`;
            const downloadURL: string = window.URL.createObjectURL(new Blob([response.body], {type: contentType}));

            const link = document.createElement('a');
            link.href = downloadURL;
            link.download = filename;
            link.click();
            observer.complete();
          }

        });
    });
  }
}
