import {inject, Injectable} from '@angular/core';
import {PublicReservationsService} from "@core/services/http/public-reservations.service";
import {DomainService} from "@core/services/domain.service";
import {NotificationsService} from "@core/services/notifications.service";
import {PublicData} from "@core/lib/interfaces/public-data";
import {Reservation} from "@core/models/reservation";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";

/**
 * This service will preload all the data needed for the public pages.
 */
@Injectable({
  providedIn: 'root'
})
export class PublicPagesDataService extends DomainService {
  private readonly reservations: PublicReservationsService = inject(PublicReservationsService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  constructor() {
    super(`public_data`);

    this.load();
  }

  load(): void {
    this.http.get<PublicData>(``).subscribe({
      next: (data: PublicData) => {
        if (data.reservation) this.reservations.created.next(new Reservation(data.reservation));
      },
      error: (error: unknown) => {
        let message: string | null = null;
        if (error instanceof HttpErrorResponse) message = parseHttpErrorMessage(error);

        this.notifications.error(message || SOMETHING_WENT_WRONG_MESSAGE);
      }
    })
  }
}
