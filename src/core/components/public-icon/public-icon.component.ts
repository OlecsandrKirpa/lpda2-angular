import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

export type PublicIcon = 'instagram' | 'whatsapp' | 'phone-call';
// import {TuiIconModule} from '@taiga-ui/experimental';

@Component({
  selector: 'app-public-icon',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './public-icon.component.html',
  styleUrl: './public-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicIconComponent {
  @Input({required: true}) icon!: PublicIcon;
}
