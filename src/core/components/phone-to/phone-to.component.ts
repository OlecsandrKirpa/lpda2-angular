import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: '[phoneTo]',
  standalone: true,
  imports: [
    TuiLinkModule,
    MatIcon
  ],
  templateUrl: './phone-to.component.html',
  styleUrl: './phone-to.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneToComponent implements OnChanges {
  @Input({required: true}) phoneTo?: string;

  @Input() whatsapp?: boolean = false;

  href?: string;

  ngOnChanges(): void {
    this.href = this.whatsapp ? `https://wa.me/${this.phoneTo}` : `tel:${this.phoneTo}`;
  }
}
