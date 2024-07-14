import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ReservationsService} from "@core/services/http/reservations.service";
import {finalize, takeUntil} from "rxjs";
import {JsonPipe} from "@angular/common";
import {TuiHintModule, TuiLoaderModule} from "@taiga-ui/core";
import {ReservationTableSummary} from "@core/lib/interfaces/reservation-table-summary";
import {ObjectToArrayPipe} from "@core/pipes/object-to-array.pipe";

@Component({
  selector: 'app-reservation-tables-summary',
  standalone: true,
  imports: [
    JsonPipe,
    TuiLoaderModule,
    ObjectToArrayPipe,
    TuiHintModule
  ],
  templateUrl: './reservation-tables-summary.component.html',
  styleUrls: ['./reservation-tables-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class ReservationTablesSummaryComponent implements OnChanges {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly service: ReservationsService = inject(ReservationsService);

  readonly data: WritableSignal<ReservationTableSummary[] | null> = signal<ReservationTableSummary[] | null>(null);

  readonly loading: WritableSignal<boolean> = signal<boolean>(false);

  /**
   * Should - when $loading is true - loader be shown?
   */
  @Input() showLoader: boolean = true;

  @Input() filters: Record<string, string | boolean> | null = null;

  ngOnChanges(): void {
    this.query();
  }

  private query(): void {
    this.loading.set(true);
    this.service.tablesSummary(this.filters ?? {}).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (data: ReservationTableSummary[]): void => {
        this.data.set(data);
      }
    })
  }
}
