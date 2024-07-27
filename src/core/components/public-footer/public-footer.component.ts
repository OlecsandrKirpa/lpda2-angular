import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {PublicPagesDataService} from "@core/services/http/public-pages-data.service";
import {TuiDestroyService, tuiPure} from "@taiga-ui/cdk";
import {takeUntil} from "rxjs";
import {JsonPipe, NgOptimizedImage} from "@angular/common";
import {TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {PublicMessageLocation, PublicMessages} from "@core/components/public-message/public-message.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [
    JsonPipe,
    TuiLinkModule,
    NgOptimizedImage,
    MatIcon,
    RouterLink
  ],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class PublicFooterComponent {
  private readonly public: PublicPagesDataService = inject(PublicPagesDataService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  readonly contacts = this.public.contacts;
  readonly messages = this.public.messages;

  @tuiPure
  contact(key: string): string | null {
    const contacts: Record<string, string> | null = this.contacts();

    if (!contacts) return null;

    return contacts[key] ?? null;
  }

  @tuiPure
  toLink(contact: string | null): string {
    if (!contact) return '';

    return contact.replace(/\s+/g, '');
  }

  @tuiPure
  message(key: PublicMessageLocation): string | null {
    const msg = this.messages();

    return msg ? (msg[key] ?? null) : null;
  }
}
