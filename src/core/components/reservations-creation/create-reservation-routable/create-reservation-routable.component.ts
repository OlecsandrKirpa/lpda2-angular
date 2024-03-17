import {Component, inject} from '@angular/core';
import {
  CreateReservationComponent
} from "@core/components/reservations-creation/create-reservation/create-reservation.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Reservation} from "@core/models/reservation";

@Component({
  selector: 'app-create-reservation-routable',
  standalone: true,
  imports: [
    CreateReservationComponent
  ],
  template: `<app-create-reservation (created)="created($event)" (cancelled)="cancelled()"></app-create-reservation>`
})
export class CreateReservationRoutableComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  created(_event: Reservation) {
    this.router.navigate([`..`], {relativeTo: this.route});
  }

  cancelled() {
    this.router.navigate([`..`], {relativeTo: this.route});
  }
}
