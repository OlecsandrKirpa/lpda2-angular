import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export const Icons = [
  `whatsapp-svg`,
  `facebook-svg`,
  `instagram-svg`,
  `tripadvisor-svg`,
] as const;

export type IconName = typeof Icons[number];

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  @Input({required: true}) name?: IconName;
}
