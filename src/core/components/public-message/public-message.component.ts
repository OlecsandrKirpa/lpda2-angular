import {Component, computed, inject, Input, signal, WritableSignal} from '@angular/core';
import {PublicMessageLocation} from "@core/lib/interfaces/public-message";
import {PublicPagesDataService} from "@core/services/http/public-pages-data.service";
import {TuiExpandModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";

export type PublicMessages = Record<string, string | null>;

/**
 * TODO: when shown in the screen, and only then, load for the first time all the messages for all locations.
 * Anyway it's not going to be a lot of messages, so it's not a big deal. Making many requests would instead be a problem.
 * When downloaded, store them in the service and in local storage for ~1 minute.
 */

@Component({
  selector: 'app-public-message',
  standalone: true,
  imports: [
    TuiExpandModule,
    MatIcon
  ],
  templateUrl: './public-message.component.html',
  styleUrl: './public-message.component.scss'
})
export class PublicMessageComponent {
  private readonly service: PublicPagesDataService = inject(PublicPagesDataService);
  readonly location$: WritableSignal<PublicMessageLocation | null> = signal(null);

  @Input({required: true}) set location(location: PublicMessageLocation) {
    this.location$.set(location);
  }

  get location(): PublicMessageLocation | null {
    return this.location$();
  }

  readonly message = computed(() => {
    const location: PublicMessageLocation | null = this.location$();
    const messages: PublicMessages | null = this.service.messages();
    if (location === null || messages === null) return null;

    return messages[location];
  })
}
