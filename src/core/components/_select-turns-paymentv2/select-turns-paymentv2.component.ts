import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, EventEmitter, inject, Input, OnInit, Output, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchResult } from '@core/lib/search-result.model';
import { PreorderReservationDate } from '@core/models/preorder-reservation-date';
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';
import { ReservationTurn } from '@core/models/reservation-turn';
import { WeekdayPipe } from '@core/pipes/weekday.pipe';
import { ReservationTurnsService } from '@core/services/http/reservation-turns.service';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiCalendarModule, TuiDropdownModule, TuiHostedDropdownModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxBlockModule, TuiInputDateMultiModule } from '@taiga-ui/kit';
import { catchError, finalize, map, Observable, of, takeUntil } from 'rxjs';
import { TuiWeekdayHandlerPipe } from "../../pipes/tui-weekday-handler.pipe";
import { ToTuiDaysPipe } from "../../pipes/to-tui-days.pipe";


export interface TurnDateOutputFormat {
  turns: number[];
  dates: { turn_id: number, date: string }[];
};

interface Turn extends ReservationTurn {
  selected?: boolean;
  dates?: Date[];
}

/**
 * Will appear like select-turns-payment but behave like preorder-reservation-group-cases.
 */
@Component({
  selector: 'app-select-turns-paymentv2',
  standalone: true,
  imports: [
    WeekdayPipe,
    TuiCheckboxBlockModule,
    FormsModule,
    TuiLoaderModule,
    DatePipe,
    TuiHostedDropdownModule,
    TuiWeekdayHandlerPipe,
    ToTuiDaysPipe,
    // TuiInputDateMultiModule,
    TuiTextfieldControllerModule,
    TuiDropdownModule,
    TuiCalendarModule,
    JsonPipe,
    TuiButtonModule,
  ],
  templateUrl: './select-turns-paymentv2.component.html',
  styleUrl: './select-turns-paymentv2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class SelectTurnsPaymentv2Component implements OnInit {
  private readonly turnsService: ReservationTurnsService = inject(ReservationTurnsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly date: DatePipe = inject(DatePipe);

  @Output() outputMamiChanges = new EventEmitter<TurnDateOutputFormat>();

  readonly loading: WritableSignal<boolean> = signal(false);

  readonly inputTurns: WritableSignal<ReservationTurn[]> = signal([]);
  @Input() set turns(v: ReservationTurn[]) {
    this.inputTurns.set(v);
  }

  readonly inputDates: WritableSignal<{ date: Date, reservation_turn: { id: number, weekday: number } }[]> = signal([]);
  @Input() set dates(v: any[]) {
    this.inputDates.set(v);
  }

  @Input() editable: boolean = false;

  @Input() set item(v: PreorderReservationGroup | null | undefined) {
    this.turns = v?.turns ?? [];
    this.dates = v?.dates ?? [];
  }

  readonly allTurns = signal<ReservationTurn[]>([]);

  /**
   * Turns grouped by weekday
   */
  readonly turnsPerDay: Signal<{ [weekday: number]: Turn[] }> = computed(() => {
    if (this.allTurns().length === 0) return {};
    // console.log(`turnsPerDay`);

    const turns: ReservationTurn[] = this.allTurns().filter(turn => turn.weekday != undefined);
    const result: { [weekday: number]: Turn[] } = {};

    for (const turn of turns) {
      if (turn.weekday == null || turn.weekday == undefined) {
        throw new Error('Turns must have a weekday');
      }

      result[turn.weekday] ||= [];
      result[turn.weekday].push({ ...turn });
    }

    /**
     * Items present in inputTurns are turns that always require payment.
     */
    this.inputTurns().forEach(turn => {
      if (turn.weekday == null || turn.weekday == undefined) {
        throw new Error('inputTurns must have a weekday', turn.weekday);
      }

      const item = result[turn.weekday]?.find(t => t.id === turn.id);
      if (!item) {
        console.error(`not found turn ${turn.id} inside allTurns`, { turn, all: [...this.allTurns()] });
      } else {
        item.selected = true;
      }
    });

    /**
     * Items presentin inputDates are dates that require payment for specific turns.
     */
    this.inputDates().forEach(date => {
      const turn = date.reservation_turn;
      if (!(turn && turn.id && turn.weekday != undefined && date.date)) {
        console.error('Date turn id is missing or invalid.', { turn, date, dates: this.inputDates() });
        return;
      }

      const item = result[turn.weekday]?.find(t => t.id === turn.id);
      if (!item) {
        console.error(`not found turn ${turn.id} inside allTurns`, { turn, all: [...this.allTurns()] });
      } else {
        item.selected = true;
        item.dates ||= [];
        item.dates.push(new Date(date.date));
      }
    });

    return result;
  });

  /**
   * Weekdays with turns
   */
  readonly weekdays: Signal<number[]> = computed(() => Object.keys(this.turnsPerDay()).map(Number));

  ngOnInit(): void {
    this.searchTurns();
  }

  addDate(turnId: number | undefined, day: TuiDay) {
    if (!turnId) {
      console.error('Invalid turn id', turnId);
      return;
    }

    const indexInTurns = this.inputTurns().findIndex(t => t.id === turnId);

    if (indexInTurns != -1) {
      this.inputTurns.update(turns => {
        turns.splice(indexInTurns, 1);
        return turns;
      });

      this.inputTurns.set([...this.inputTurns()]);

      return;
    }

    const date: string | null = this.date.transform(day.toUtcNativeDate(), 'yyyy-MM-dd');
    if (!date) {
      console.error('Invalid date', day);
      return;
    }

    const indexInDates = this.inputDates().findIndex(d => d.reservation_turn?.id === turnId && this.date.transform(d.date, 'yyyy-MM-dd') === date);

    this.inputDates.update(dates => {
      if (indexInDates != -1) {
        dates.splice(indexInDates, 1);
      } else {
        dates.push({
          date: day.toUtcNativeDate(),
          reservation_turn: { id: turnId, weekday: day.dayOfWeek(false) }
        });
      }

      dates = dates.sort((a, b) => a.date.getTime() - b.date.getTime());

      return dates;
    });

    // Triggering changes
    this.inputDates.set([...this.inputDates()]);
  }

  private lastOutput: TurnDateOutputFormat | null = null;
  private emitChanges(): void {
    const out: TurnDateOutputFormat = {
      dates: this.inputDates().map(d => ({
        turn_id: d.reservation_turn.id,
        date: this.date.transform(d.date, 'yyyy-MM-dd')
      })).filter((d): d is { date: string, turn_id: number } => typeof d.turn_id === "number" && d.turn_id > 0 && d.date != null),
      turns: this.inputTurns().map(t => t.id).filter((t: unknown): t is number => typeof t === 'number' && t > 0)
    };

    if (this.lastOutput && JSON.stringify(this.lastOutput) === JSON.stringify(out)) {
      return;
    }

    this.lastOutput = out;
    this.outputMamiChanges.emit(out);
  }

  private searchTurns(): void {
    this.loading.set(true);
    this.turnsService.search({
      per_page: 1000
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
      map((data: SearchResult<ReservationTurn>) => data.items),
      catchError((error: unknown) => {
        console.error(error);
        return of([]);
      })
    ).subscribe({
      next: (data: ReservationTurn[]) => {
        this.allTurns.set(data);
      }
    });
  }
}
