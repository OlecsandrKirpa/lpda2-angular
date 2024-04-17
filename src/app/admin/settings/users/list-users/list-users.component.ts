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
import {RouterLink, RouterOutlet} from "@angular/router";
import {CommonModule, DatePipe} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiAutoFocusModule, TuiDestroyService} from "@taiga-ui/cdk";
import {TuiButtonModule, TuiHintModule, TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {ShowImageComponent} from "@core/components/show-image/show-image.component";
import {TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {orderBy, OrderByComponent} from "@core/components/order-by/order-by.component";
import {PhoneToComponent} from "@core/components/phone-to/phone-to.component";
import {MailToComponent} from "@core/components/mail-to/mail-to.component";
import {SearchResult} from "@core/lib/search-result.model";
import {NotificationsService} from "@core/services/notifications.service";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {User} from "@core/models/user";
import {UsersService} from "@core/services/http/users.service";
import {ListUsersFiltersComponent, UsersFilters} from "./list-users-filters/list-users-filters.component";

@Component({
  selector: 'app-list-users',
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
    ListUsersFiltersComponent,
    PhoneToComponent,
    MailToComponent,
  ],
  templateUrl: './list-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ],
})
export class ListUsersComponent implements OnInit {
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly data: WritableSignal<SearchResult<User> | null> = signal(null);
  readonly items: Signal<User[]> = computed(() => this.data()?.items || []);
  private readonly service: UsersService = inject(UsersService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly date = inject(DatePipe);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  // @ViewChild(UserTurnSelectComponent, {static: true}) turnSelect?: UserTurnSelectComponent;

  readonly inputSize: "s" | "m" | "l" = 'm';

  filters: Partial<UsersFilters> = {};

  ngOnInit(): void { }

  delete(userId: number | undefined): void {
    if (!(userId)) return;

    this.notifications.confirm($localize`Sei sicuro di voler cancellare questo utente?`).subscribe({
      next: (confirmed: boolean): void => {
        if (confirmed) this.confirmedDelete(userId);
      }
    });
  }

  filtersChanged(filters: Partial<UsersFilters>): void {
    this.filters = filters;
    this.search(filters);
  }

  // triggerOrder(field: string, asc: boolean | null): void {
  //   if (asc == null) {
  //     this.order = undefined;
  //     return this.search();
  //   }
  //
  //   this.order = { field, asc };
  //   this.search();
  // }

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

  private search(filters: Partial<UsersFilters> = this.filters): void {
    filters ||= {};
    filters = {...filters};
    // const order: orderBy | null = this.order.value;
    // if (this.order.valid && order) {
    //   filters.order_by_field = order.field;
    //   filters.order_by_direction = order.asc ? "ASC" : "DESC";
    // }

    this.loading.set(true);
    this.service.search(filters).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (result: SearchResult<User>) => {
        this.data.set(result);
      },
      error: (error: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(error) || $localize`Qualcosa è andato storto nella ricerca.`);
        console.error(error);
      }
    });
  }
}
