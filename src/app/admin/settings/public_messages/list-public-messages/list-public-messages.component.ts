import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from "@angular/router";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {SearchResult} from "@core/lib/search-result.model";
import {User} from "@core/models/user";
import {UsersService} from "@core/services/http/users.service";
import {NotificationsService} from "@core/services/notifications.service";
import {DatePipe, JsonPipe, NgTemplateOutlet} from "@angular/common";
import {UsersFilters} from "../../users/list-users/list-users-filters/list-users-filters.component";
import {filter, finalize, takeUntil, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {MatIcon} from "@angular/material/icon";
import {TuiButtonModule, TuiHintModule, TuiLinkModule} from "@taiga-ui/core";
import {PublicMessage} from "@core/models/public-message";
import {PublicMessagesService} from "@core/services/http/public-messages.service";
import {PublicMessageKeyPipe} from "@core/pipes/public-message-key.pipe";
import {ShowTranslationsComponent} from "@core/components/show-translations/show-translations.component";
import {TuiTablePagination, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {FormControl, FormGroup} from "@angular/forms";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-list-public-messages',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIcon,
    TuiHintModule,
    TuiButtonModule,
    NgTemplateOutlet,
    JsonPipe,
    PublicMessageKeyPipe,
    TuiLinkModule,
    RouterLink,
    ShowTranslationsComponent,
    TuiTablePaginationModule
  ],
  templateUrl: './list-public-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class ListPublicMessagesComponent implements OnInit {
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly data: WritableSignal<SearchResult<PublicMessage> | null> = signal(null);
  readonly items: Signal<PublicMessage[]> = computed(() => this.data()?.items || []);

  private readonly service: PublicMessagesService = inject(PublicMessagesService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly date = inject(DatePipe);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  readonly _ = inject(Title).setTitle($localize`Comunicazioni | La Porta D'Acqua`);

  readonly inputSize: "s" | "m" | "l" = 'm';

  readonly form: FormGroup = new FormGroup({
    offset: new FormControl(0),
    per_page: new FormControl(10),
  })

  ngOnInit(): void {
    this.search();

    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter((ev: unknown): ev is NavigationEnd => ev instanceof NavigationEnd),
      tap(() => this.search())
    ).subscribe();

    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
      tap(() => this.search())
    ).subscribe({
      next: () => {
        this.search();
      }
    })
  }

  private search(filters: Record<string, string | number | boolean> = {}): void {
    filters = {...filters, ...this.form.value};

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

  paginationChange(event: TuiTablePagination) {
    this.form.patchValue({offset: event.page, per_page: event.size});
  }
}
