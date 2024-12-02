import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal, ViewChild,
  WritableSignal
} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiAutoFocusModule, TuiDay, TuiDestroyService} from "@taiga-ui/cdk";
import {TuiButtonModule, TuiExpandModule, TuiHintModule, TuiLinkModule, TuiLoaderModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {RouterLink, RouterOutlet} from "@angular/router";
import {ShowImageComponent} from "@core/components/show-image/show-image.component";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {SearchResult} from "@core/lib/search-result.model";
import {NotificationsService} from "@core/services/notifications.service";
import {
  debounceTime,
  delay,
  filter,
  finalize,
  map,
  merge,
  Observable,
  Subject,
  Subscription,
  takeUntil,
  tap
} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {nue} from "@core/lib/nue";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {Reservation} from "@core/models/reservation";
import {ReservationsService} from "@core/services/http/reservations.service";
import {
  ReservationStatusSelectComponent
} from "@core/components/reservation-status-select/reservation-status-select.component";

import {
  ReservationDateSelectComponent
} from "@core/components/reservation-date-select/reservation-date-select.component";
import {ReservationTurn} from "@core/models/reservation-turn";
import {
  ReservationTurnSelectComponent
} from "@core/components/dynamic-selects/reservation-turn-select/reservation-turn-select.component";
import {
  ListReservationsFiltersComponent, ReservationsFilters
} from "@core/components/list-reservations-filters/list-reservations-filters.component";
import {orderBy, OrderByComponent} from "@core/components/order-by/order-by.component";
import {ReservationEventsComponent} from "@core/components/reservation-events/reservation-events.component";
import {PhoneToComponent} from "@core/components/phone-to/phone-to.component";
import {MailToComponent} from "@core/components/mail-to/mail-to.component";
import {ReservationPeopleComponent} from "@core/components/reservation-people/reservation-people.component";
import { Title } from '@angular/platform-browser';
import { NoItemsComponent } from "../../../../core/components/no-items/no-items.component";
import { AdminReservationPaymentComponent } from "../../../../core/components/admin-reservation-payment/admin-reservation-payment.component";
import { EipReservationStatusComponent } from "../../../../core/components/eip-reservation-status/eip-reservation-status.component";
import { ReservationStatus, ReservationStatusTranslations } from '@core/lib/interfaces/reservation-data';
import { ReservationTablesSummaryComponent } from "../../../../core/components/reservation-tables-summary/reservation-tables-summary.component";

@Component({
  selector: 'app-admin-reservations-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiAutoFocusModule,
    TuiButtonModule,
    MatIcon,
    RouterLink,
    TuiLinkModule,
    RouterOutlet,
    ShowImageComponent,
    TuiTablePaginationModule,
    TuiHintModule,
    ReservationStatusSelectComponent,
    ReservationTurnSelectComponent,
    ReservationDateSelectComponent,
    ListReservationsFiltersComponent,
    ListReservationsFiltersComponent,
    OrderByComponent,
    ReservationEventsComponent,
    PhoneToComponent,
    MailToComponent,
    ReservationPeopleComponent,
    NoItemsComponent,
    TuiLoaderModule,
    AdminReservationPaymentComponent,
    FormsModule,
    EipReservationStatusComponent,
    TuiExpandModule,
    ReservationTablesSummaryComponent
],
  templateUrl: './admin-reservations-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ],
})
export class AdminReservationsHomeComponent implements OnInit {

  readonly loading: WritableSignal<boolean> = signal(false);
  readonly data: WritableSignal<SearchResult<Reservation> | null> = signal(null);
  readonly items: Signal<Reservation[]> = computed(() => this.data()?.items || []);
  private readonly service: ReservationsService = inject(ReservationsService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly date = inject(DatePipe);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  readonly _ = inject(Title).setTitle($localize`Prenotazioni | La Porta D'Acqua`);

  @ViewChild(ReservationTurnSelectComponent, {static: true}) turnSelect?: ReservationTurnSelectComponent;

  readonly inputSize: "s" | "m" | "l" = 'm';
  private readonly defaultOrder: orderBy = {field: "datetime", asc: true};

  filters: Partial<ReservationsFilters> = {};
  order: FormControl<orderBy | null> = new FormControl<orderBy | null>(null);

  ngOnInit(): void {
    this.order.valueChanges.subscribe({
      next: (value: any) => {
        this.search();
      }
    })
  }

  updateStatus(item: Reservation, status: ReservationStatus): void {
    const id = item.id;
    if (!(id && status)) {
      this.notifications.error();
      return;
    }

    this.notifications.confirm(`La prenotazione verrà aggiornata.`, { title: $localize`Prenotazione ${item.fullname} x ${(item.adults || 0) + (item.children || 0)} in stato ${ReservationStatusTranslations[status].title}` }).subscribe({
      next: (confirmed: boolean): void => {
        if (confirmed) {
          this.confirmedUpdateStatus(id, status);
        }
      }
    });
  }

  delete(reservationId: number | undefined): void {
    if (!(reservationId)) return;

    this.notifications.confirm($localize`Sei sicuro di voler cancellare questa prenotazione?`).subscribe({
      next: (confirmed: boolean): void => {
        if (confirmed) this.confirmedDelete(reservationId);
      }
    });
  }

  filtersChanged(filters: Partial<ReservationsFilters>): void {
    this.filters = filters;
    this.search(filters);
  }

  private confirmedUpdateStatus(id: number, status: ReservationStatus): void {
    this.loading.set(true);
    const req = status == "deleted" ? this.service.destroy(id) : this.service.updateStatus(id, status);

    req.pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: () => {
        this.notifications.fireSnackBar($localize`Stato aggiornato con successo.`);
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(error) || $localize`Qualcosa è andato storto nell'aggiornamento dello stato.`);
      }
    });
  }

  private confirmedDelete(id: number): void {
    this.loading.set(true);
    this.service.destroy(id).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.loading.set(false);
        this.search();
      }),
    ).subscribe({
      error: (error: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(error) || $localize`Qualcosa è andato storto nella cancellazione.`);
      }
    })
  }

  private search(filters: Partial<ReservationsFilters> = this.filters): void {
    filters ||= {};
    filters = {...filters};
    const order: orderBy | null = this.order.value;
    if (this.order.valid && order) {
      filters.order_by_field = order.field;
      filters.order_by_direction = order.asc ? "ASC" : "DESC";
    }

    this.loading.set(true);
    this.service.search(filters).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (result: SearchResult<Reservation>) => {
        this.data.set(result);
      },
      error: (error: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(error) || $localize`Qualcosa è andato storto nella ricerca.`);
        console.error(error);
      }
    });
  }
}
