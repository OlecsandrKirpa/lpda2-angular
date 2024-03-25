import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: '[mailTo]',
  standalone: true,
  imports: [
    TuiLinkModule,
    MatIcon
  ],
  templateUrl: './mail-to.component.html',
  styleUrl: './mail-to.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailToComponent {
  @Input({required: true}) mailTo?: string;
}
