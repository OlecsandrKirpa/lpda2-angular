import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { PreorderReservationGroupFormComponent } from "../../../../../core/components/preorder-reservation-group-form/preorder-reservation-group-form.component";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';
import { PreorderReservationGroupsService } from '@core/services/http/preorder-reservation-groups.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { NotificationsService } from '@core/services/notifications.service';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [PreorderReservationGroupFormComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
  ],
})
export class NewComponent {

  private readonly service = inject(PreorderReservationGroupsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly loading: WritableSignal<boolean> = signal(false);

  submit(data: Record<string, unknown>): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.service.create(data).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(e) || SOMETHING_WENT_WRONG_MESSAGE);
      }
    })
  }
}
