import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';
import { PreorderReservationGroupsService } from '@core/services/http/preorder-reservation-groups.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core';
import { finalize, takeUntil } from 'rxjs';
import { PreorderReservationGroupPreorderTypeComponent } from "../../../../../core/components/preorder-reservation-group-preorder-type/preorder-reservation-group-preorder-type.component";
import { PreorderReservationGroupStatusComponent } from "../../../../../core/components/preorder-reservation-group-status/preorder-reservation-group-status.component";
import { CurrencyPipe } from '@angular/common';
import { NotificationsService } from '@core/services/notifications.service';
import { PreorderReservationGroupCasesComponent } from "../../../../../core/components/preorder-reservation-group-cases/preorder-reservation-group-cases.component";
import { SelectTurnsPaymentv2Component } from "../../../../../core/components/select-turns-paymentv2/select-turns-paymentv2.component";

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [
    TuiLoaderModule,
    PreorderReservationGroupPreorderTypeComponent,
    PreorderReservationGroupStatusComponent,
    CurrencyPipe,
    TuiLinkModule,
    RouterModule,
    TuiButtonModule,
    PreorderReservationGroupCasesComponent,
    SelectTurnsPaymentv2Component
],
  templateUrl: './show.component.html',
  styleUrl: './show.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
  ],
})
export class ShowComponent {

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

  // submit(data: Record<string, unknown>): void {
  //   if (!(this.itemId)) return;

  //   this.loading.set(true);
  //   this.service.update(this.itemId, data).pipe(
  //     takeUntil(this.destroy$),
  //     finalize(() => this.loading.set(false))
  //   ).subscribe({
  //     next: () => {
  //       this.router.navigate(['../'], { relativeTo: this.route });
  //     }
  //   })
  // }

  delete() {
    this.notifications.confirm($localize`Eliminando questo elemento, non verra più chiesto il pagamento alla prenotazione per i casi che prevedeva.`).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (confirmed: boolean): void => {
        if (confirmed) this.confirmedDelete();
      }
    })
  }

  private confirmedDelete(): void {
    if (!(this.itemId)) return;

    this.loading.set(true);
    this.service.destroy(this.itemId).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.loading.set(false);
        this.router.navigate(['../'], { relativeTo: this.route });
      })
    ).subscribe();
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
