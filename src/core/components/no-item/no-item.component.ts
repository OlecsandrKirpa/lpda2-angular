import { Component, Input } from '@angular/core';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiBlockStatusModule } from '@taiga-ui/layout';

@Component({
  selector: 'app-no-item',
  standalone: true,
  imports: [
    TuiLoaderModule,
    TuiBlockStatusModule,
  ],
  templateUrl: './no-item.component.html',
})
export class NoItemComponent {
  @Input() showLoader: boolean = false;
}
