import {Component, Input} from '@angular/core';

export type weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export const PublicMessageLocations = [
  `home-landing`,
  `home-about`,
  `home-menu`,
  `home-instagram`,
  `home-reserve`,
  `new-reservation-form`,
  `existing-reservation-form`,
] as const;

export type PublicMessageLocation = typeof PublicMessageLocations[number] | `openings_${weekday}`;

export type PublicMessages = Record<string, string | null>;

/**
 * TODO: when shown in the screen, and only then, load for the first time all the messages for all locations.
 * Anyway it's not going to be a lot of messages, so it's not a big deal. Making many requests would instead be a problem.
 * When downloaded, store them in the service and in local storage for ~1 minute.
 */

@Component({
  selector: 'app-public-message',
  standalone: true,
  imports: [],
  templateUrl: './public-message.component.html',
  styleUrl: './public-message.component.scss'
})
export class PublicMessageComponent {
  @Input({required: true}) location!: PublicMessageLocation;
}
