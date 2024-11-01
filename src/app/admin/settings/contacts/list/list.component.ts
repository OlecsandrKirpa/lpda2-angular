import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  isDevMode,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationsService} from "@core/services/notifications.service";
import {ActivatedRoute, NavigationEnd, Router, RouterModule} from "@angular/router";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";
import {TuiLinkModule} from "@taiga-ui/core";
import {JsonPipe} from "@angular/common";
import { Title } from '@angular/platform-browser';
import { ContactsService } from '@core/services/http/contacts.service';
import { Contact, ContactValue } from '@core/lib/interfaces/contact';
import { HumanizeContactKeyPipe } from "../../../../../core/pipes/humanize-contact-key.pipe";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.component.html',
  imports: [
    HumanizeContactKeyPipe,
    RouterModule,
    MatIconModule,
    TuiLinkModule,
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
  ]
})
export class ListComponent implements OnInit {
  private readonly service: ContactsService = inject(ContactsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly router: Router = inject(Router);

  readonly _ = inject(Title).setTitle($localize`Contatti | La Porta D'Acqua`);

  readonly items: WritableSignal<Contact[]> = signal([]);

  private readonly saving: WritableSignal<boolean> = signal(false);
  private readonly searching: WritableSignal<boolean> = signal(false);

  readonly loading = computed(() => this.saving() || this.searching());

  ngOnInit(): void {
    this.reload();

    this.router.events.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (e: unknown) => {
        if (e instanceof NavigationEnd) this.reload();
      }
    })
  }

  private reload(): void {
    this.searching.set(true);
    this.service.search().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.searching.set(false)),
    ).subscribe({
      next: (data: { items: Contact[] }): void => {
        // this.updateFormByData(data.items);
        this.items.set(data.items);
      },
      error: (e: HttpErrorResponse): void => {
        this.notifications.error(parseHttpErrorMessage(e) || SOMETHING_WENT_WRONG_MESSAGE);
      }
    })
  }
}
