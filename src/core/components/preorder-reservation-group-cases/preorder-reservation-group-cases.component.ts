import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { PreorderReservationDate } from '@core/models/preorder-reservation-date';
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';
import { ReservationTurn } from '@core/models/reservation-turn';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { WeekdayPipe } from "../../pipes/weekday.pipe";

/**
 * Case when payment is required.
 */
interface Case {
  turn: ReservationTurn;

  // When true, the payment is always required. Otherwise for specific dates.
  dates: true | Date[];
}

@Component({
  selector: 'app-preorder-reservation-group-cases',
  standalone: true,
  imports: [
    JsonPipe,
    DatePipe,
    WeekdayPipe
],
  templateUrl: './preorder-reservation-group-cases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class PreorderReservationGroupCasesComponent implements OnChanges {
  private readonly destroy$ = inject(TuiDestroyService);

  @Input() turns: ReservationTurn[] = [];
  @Input() dates: PreorderReservationDate[] = [];

  @Input() set item(v: PreorderReservationGroup | null | undefined){
    this.turns = v?.turns ?? [];
    this.dates = v?.dates ?? [];
  }

  readonly cases: WritableSignal<Case[]> = signal([]);

  ngOnChanges(changes: SimpleChanges): void {
      this.calcCases();
  }

  private calcCases(): void {
    const items: Record<number, Case> = {};

    for (const turn of this.turns) {
      if (!(turn.id)){
        console.error('Turn id is missing', {turn, turns: this.turns});
        continue;
      }

      items[turn.id] = {
        turn,
        dates: true
      };
    }

    for (const date of this.dates) {
      const turn = date.reservation_turn;
      if (!(turn && turn.id)){
        console.error('Date turn id is missing', {date, dates: this.dates});
        continue;
      }

      items[turn.id] ||= { turn: turn, dates: []};

      const item: Case = items[turn.id];

      if (item.dates === true){
        console.error(`Resetted dates to [] from true`, item, this);
        continue;
      }

      if (!(date.date)) {
        console.error('Date date is missing', {date, dates: this.dates});
        continue;
      }

      item.dates.push(date.date);
    }
    
    const nowTime = new Date().getTime() - 1000 * 60 * 60 * 24;
    this.cases.set(
      Object.values(items).sort((a: Case, b: Case) => Number(a.turn.weekday) - Number(b.turn.weekday)).map((item: Case) => {
        if (item.dates === true) {
          return item;
        }

        item.dates = item.dates
          .filter((d: Date) => d.getTime() >= nowTime)
          .sort((a: Date, b: Date) => a.getTime() - b.getTime());

        return item
      }).filter((item: Case) => item.dates === true || item.dates.length > 0)
    );
    // const orderedCases = Object.values(items)
  }
}
