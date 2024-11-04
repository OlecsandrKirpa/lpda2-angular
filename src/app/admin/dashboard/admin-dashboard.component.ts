import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ReservationsByHourBarChartComponent } from '@core/components/reservations-by-hour-bar-chart/reservations-by-hour-bar-chart.component';
import { TuiLinkModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReservationsByHourBarChartComponent,
    TuiLinkModule,
    RouterModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  readonly _ = inject(Title).setTitle($localize`Dashboard | La Porta D'Acqua`);
}
