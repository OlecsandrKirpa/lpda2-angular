import { Component, Input } from '@angular/core';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiBlockStatusModule } from '@taiga-ui/layout';

@Component({
  selector: 'app-no-items',
  standalone: true,
  imports: [
    TuiLoaderModule,
    TuiBlockStatusModule,
  ],
  templateUrl: './no-items.component.html',
  styleUrl: './no-items.component.scss'
})
export class NoItemsComponent {
  @Input() showLoader: boolean = false;
}
