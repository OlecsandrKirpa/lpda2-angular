import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { PreorderReservationDate } from '@core/models/preorder-reservation-date';
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';
import { ReservationTurn } from '@core/models/reservation-turn';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { WeekdayPipe } from "../../pipes/weekday.pipe";
import { TuiButtonModule, TuiCalendarModule, TuiExpandModule, TuiGroupModule, TuiHintModule } from '@taiga-ui/core';
import { TuiInputDateModule, TuiInputDateMultiModule, TuiRadioBlockModule, TuiRadioModule } from '@taiga-ui/kit';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToTuiDaysPipe } from "../../pipes/to-tui-days.pipe";
import { TuiWeekdayHandlerPipe } from "../../pipes/tui-weekday-handler.pipe";
import { ReservationTurnSelectComponent } from "../dynamic-selects/reservation-turn-select/reservation-turn-select.component";
import { takeUntil } from 'rxjs';
import { SelectTurnsPaymentComponent } from "../select-turns-payment/select-turns-payment.component";

/**
 * Case when payment is required.
 */
interface Case {
  turn: ReservationTurn;

  // When true, the payment is always required. Otherwise for specific dates.
  dates: true | Date[];

  editing?: boolean;
}

export interface TurnDateOutputFormat {
  turns: number[];
  dates: { turn_id: number, date: string }[];
}

@Component({
  selector: 'app-preorder-reservation-group-cases',
  standalone: true,
  imports: [
    JsonPipe,
    DatePipe,
    WeekdayPipe,
    TuiButtonModule,
    TuiHintModule,
    TuiExpandModule,
    TuiRadioBlockModule,
    TuiGroupModule,
    TuiRadioModule,
    FormsModule,
    TuiCalendarModule,
    TuiInputDateMultiModule,
    ToTuiDaysPipe,
    TuiWeekdayHandlerPipe,
    ReservationTurnSelectComponent,
    ReactiveFormsModule,
    SelectTurnsPaymentComponent
],
  templateUrl: './preorder-reservation-group-cases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class PreorderReservationGroupCasesComponent implements OnChanges {

  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly date: DatePipe = inject(DatePipe);

  @Output() outputMamiChanges = new EventEmitter<TurnDateOutputFormat>();

  @Input() turns: ReservationTurn[] = [];
  @Input() dates: PreorderReservationDate[] = [];

  @Input() editable: boolean = false;

  readonly addingTurn = new FormControl<ReservationTurn | null>(null);

  readonly selectedTurns = (turn: ReservationTurn): boolean => {
    return this.cases().some((c: Case) => c.turn.id === turn.id);
  }

  @Input() set item(v: PreorderReservationGroup | null | undefined) {
    this.turns = v?.turns ?? [];
    this.dates = v?.dates ?? [];
  }

  readonly cases: WritableSignal<Case[]> = signal([]);

  ngOnInit(): void {
    this.addingTurn.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (turn: ReservationTurn | null) => {
        if (turn) {
          this.addTurn(turn);
          this.addingTurn.reset();
        }
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calcCases();

    this.emitChanges();
  }

  deleteAt(index: number) {
    this.cases.update((cases) => {
      cases.splice(index, 1);
      return cases;
    });

    this.emitChanges();
  }

  updateScenarioDates(scenarioIndex: number, dates: true | (TuiDay | Date)[]): void {
    this.cases.update((cases) => {
      if (Array.isArray(dates)) {
        cases[scenarioIndex].dates = dates.map((d: TuiDay | Date): Date => {
          if (d instanceof Date) return d;

          return d.toLocalNativeDate();
        });
      } else {
        cases[scenarioIndex].dates = true;
      }
      return cases;
    });

    this.emitChanges();
  }

  addTurn(turn: ReservationTurn) {
    this.cases.update((cases) => {
      cases.push({
        turn,
        dates: true,
        editing: true
      });

      return cases;
    });

    this.emitChanges();
  }

  private calcCases(): void {
    const items: Record<number, Case> = {};

    for (const turn of this.turns) {
      if (!(turn.id)) {
        console.error('Turn id is missing', { turn, turns: this.turns });
        continue;
      }

      items[turn.id] = {
        turn,
        dates: true
      };
    }

    for (const date of this.dates) {
      const turn = date.reservation_turn;
      if (!(turn && turn.id)) {
        console.error('Date turn id is missing', { date, dates: this.dates });
        continue;
      }

      items[turn.id] ||= { turn: turn, dates: [] };

      const item: Case = items[turn.id];

      if (item.dates === true) {
        console.error(`Resetted dates to [] from true`, item, this);
        continue;
      }

      if (!(date.date)) {
        console.error('Date date is missing', { date, dates: this.dates });
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

  private emitChanges(): void {
    const turns: TurnDateOutputFormat["turns"] = [];
    const dates: TurnDateOutputFormat["dates"] = [];
    this.cases().forEach((c: Case) => {
      if (!(c.turn.id)) {
        console.error('Turn id is missing', c);
        throw new Error('Turn id is missing');
      }

      if (c.dates === true) {
        turns.push(c.turn.id);
      } else {
        c.dates.forEach((d: Date) => {
          if (!(c.turn.id)) {
            console.error('Turn id is missing', c);
            throw new Error('Turn id is missing');
          }

          // Need date as YYYY-MM-DD
          dates.push({
            turn_id: c.turn.id,
            date: this.date.transform(d, 'yyyy-MM-dd') ?? ''
          });
        });
      }
    });

    this.outputMamiChanges.emit({ turns, dates });
  }
}
