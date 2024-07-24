import {inject, Injectable} from '@angular/core';
import {DomainService} from "@core/services/domain.service";
import {NotificationsService} from "@core/services/notifications.service";
import {PublicData} from "@core/lib/interfaces/public-data";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";
import {BehaviorSubject} from "rxjs";

/**
 * This service will preload all the data needed for the public pages.
 */
@Injectable({
  providedIn: 'root'
})
export class PublicPagesDataService extends DomainService {
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly data$: BehaviorSubject<PublicData | null> = new BehaviorSubject<PublicData | null>(null);

  constructor() {
    super(`public_data`);

    this.load();
  }

  load(): void {
    this.http.get<PublicData>(``).subscribe({
      next: (data: PublicData) => {
        // if (data.reservation) this.reservations.created.next(new Reservation(data.reservation));
        this.data$.next(data);
      },
      error: (error: unknown) => {
        this.notifications.error(error instanceof HttpErrorResponse ? parseHttpErrorMessage(error) : SOMETHING_WENT_WRONG_MESSAGE);
      }
    })
  }
}
