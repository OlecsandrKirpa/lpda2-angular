import { ChangeDetectionStrategy, Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { ReservationsService } from '@core/services/http/reservations.service';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { ECharts, EChartsOption } from 'echarts';
import { StatsService } from '@core/services/http/stats.service';
import { Stats } from '@core/lib/interfaces/stats';
import { finalize, takeUntil } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiLoaderModule } from '@taiga-ui/core';
import { NotificationsService } from '@core/services/notifications.service';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';

@Component({
  selector: 'app-reservations-by-hour-bar-chart',
  standalone: true,
  imports: [
    NgxEchartsDirective,
    TuiLoaderModule,
  ],
  templateUrl: './reservations-by-hour-bar-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideEcharts(),
    TuiDestroyService
  ]
})
export class ReservationsByHourBarChartComponent {
  private readonly service = inject(StatsService);
  private readonly destroy$ = inject(TuiDestroyService);
  private readonly notifications = inject(NotificationsService);
  private readonly datePipe = inject(DatePipe);

  private echart?: ECharts;

  readonly loading: WritableSignal<boolean> = signal(false);

  @Input() fromDate: Date = new Date();
  @Input() toDate: Date = new Date();

  onChartInit(instance: ECharts) {
    this.echart = instance;

    this.refresh();
  }

  refresh() {
    const fromDate: string = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd') || '';
    const toDate: string = this.datePipe.transform(this.toDate, 'yyyy-MM-dd') || '';

    this.loading.set(true);
    this.service.stats({
      reservations_date_from: fromDate,
      reservations_date_to: toDate,
      keys: 'reservations-by-hour'
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (stats: Partial<Stats>) => {
        if (stats["reservations-by-hour"]) {
          this.echart?.setOption(this.dataLoadedUpdateChart(stats["reservations-by-hour"]));
        } else {
          this.notifications.error('No data available :(');
        };
      },
      error: (e: unknown) => {
        this.notifications.error(e instanceof HttpErrorResponse ? parseHttpErrorMessage(e) : SOMETHING_WENT_WRONG_MESSAGE)
      }

    });
  }

  private dataLoadedUpdateChart(data: Stats["reservations-by-hour"]): EChartsOption {
    const labels: string[] = Object.keys(data);
    const values: number[] = Object.values(data);

    return {
      xAxis: {
        type: 'category',
        data: labels,
        name: $localize`Data e ora`
      },
      yAxis: {
        type: 'value',
        name: $localize`Prenotati`
      },
      series: [
        {
          data: values,
          type: 'bar'
        }
      ]
    };
  }
}
