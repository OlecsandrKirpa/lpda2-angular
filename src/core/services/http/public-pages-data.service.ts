import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {DomainService} from "@core/services/domain.service";
import {NotificationsService} from "@core/services/notifications.service";
import {PublicData} from "@core/lib/interfaces/public-data";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {toJsonIfPossible} from "@core/lib/interfaces/to_json_if_possible";
import {PublicMessageLocation, PublicMessages} from "@core/components/public-message/public-message.component";

/**
 * This service will preload all the data needed for the public pages.
 */
@Injectable({
  providedIn: 'root'
})
export class PublicPagesDataService extends DomainService {
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly data$: BehaviorSubject<PublicData | null> = new BehaviorSubject<PublicData | null>(null);

  readonly messages: WritableSignal<PublicMessages | null> = signal(null);
  readonly messages$ = this.data$.pipe(
    map((data: PublicData | null) => {
      if (!(typeof data === "object" && data !== null)) return null;

      return toJsonIfPossible(data.public_messages);
    }),
    tap((m: PublicMessages | null) => this.messages.set(m))
  );

  readonly contacts: WritableSignal<Record<string, string> | null> = signal(null);
  readonly contacts$ = this.data$.pipe(
    map((data: PublicData | null) => {
      if (!(typeof data === "object" && data !== null)) return null;

      return toJsonIfPossible(data.settings.email_contacts);
    }),
    tap((c: Record<string, string> | null) => this.contacts.set(c))
  );

  constructor() {
    super(`public_data`);

    this.load();

    [
      this.contacts$,
      this.messages$
    ].forEach((o: Observable<unknown>) => {
      o.subscribe({
        error: (e: unknown) => {
          console.warn(`unexpected error`, e);
        }
      })
    });
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
