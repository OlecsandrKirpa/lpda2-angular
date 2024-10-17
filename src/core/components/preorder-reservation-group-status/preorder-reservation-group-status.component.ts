import { Component, Input, OnChanges } from '@angular/core';
import { PreorderReservationGroupStatus } from '@core/lib/interfaces/preorder-reservation-group-data';
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';

@Component({
  selector: 'app-preorder-reservation-group-status',
  standalone: true,
  imports: [],
  templateUrl: './preorder-reservation-group-status.component.html',
  styleUrl: './preorder-reservation-group-status.component.scss'
})
export class PreorderReservationGroupStatusComponent implements OnChanges {
  @Input() item?: PreorderReservationGroup;

  status?: "active" | "inactive";

  ngOnChanges(): void {
    if (this.item?.status != 'active') {
      this.status = 'inactive';
      return;
    }

    this.status = 'active';

    // const activeFromPassed = this.item.active_from == undefined ? true :new Date(this.item.active_from) < new Date();
    // const activeUntilPassed = this.item.active_to == undefined ? true : new Date(this.item.active_to) > new Date();

    // this.status = activeFromPassed && activeUntilPassed ? 'active' : 'inactive';
  }
}
