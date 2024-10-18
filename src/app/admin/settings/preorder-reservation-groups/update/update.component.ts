import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { PreorderReservationGroupFormComponent } from "../../../../../core/components/preorder-reservation-group-form/preorder-reservation-group-form.component";
import { PreorderReservationGroupsService } from '@core/services/http/preorder-reservation-groups.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { finalize, takeUntil } from 'rxjs';
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';
import { TuiLoaderModule } from '@taiga-ui/core';
import { NotificationsService } from '@core/services/notifications.service';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    PreorderReservationGroupFormComponent,
    TuiLoaderModule,
  ],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
  ],
})
export class UpdateComponent {

  private readonly service = inject(PreorderReservationGroupsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly item: WritableSignal<PreorderReservationGroup | null> = signal(null);
  readonly loading: WritableSignal<boolean> = signal(false);
  private itemId: number | null = null;

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (p: Params) => {
        this.itemId = Number(p["id"]);
        if (!isNaN(this.itemId)) {
          this.load(this.itemId);
        } else {
          this.item.set(null);
        }
      }
    })
  }

  submit(data: Record<string, unknown>): void {
    if (!(this.itemId)) return;
    if (this.loading()) return;

    this.loading.set(true);
    this.service.update(this.itemId, data).pipe(
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

  private load(id: number): void {
    this.loading.set(true);
    this.service.show(id).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (item: PreorderReservationGroup) => this.item.set(item),
    })
  }
}
