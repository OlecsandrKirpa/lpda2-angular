import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, EventEmitter, inject, Input, OnInit, Output, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchResult } from '@core/lib/search-result.model';
import { PreorderReservationDate } from '@core/models/preorder-reservation-date';
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';
import { ReservationTurn } from '@core/models/reservation-turn';
import { WeekdayPipe } from '@core/pipes/weekday.pipe';
import { ReservationTurnsService } from '@core/services/http/reservation-turns.service';
import { TuiDay, TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiCalendarModule, TuiDropdownModule, TuiHostedDropdownModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxBlockModule, TuiInputDateMultiModule } from '@taiga-ui/kit';
import { catchError, finalize, map, Observable, of, takeUntil } from 'rxjs';
import { TuiWeekdayHandlerPipe } from "../../pipes/tui-weekday-handler.pipe";
import { dateToTuiDay } from '@core/lib/tui-datetime-to-iso-string';
import { FromTuiDayPipe } from '@core/pipes/from-tui-day.pipe';
import { DateAfterPipe } from "../../pipes/date-after.pipe";


export interface TurnDateOutputFormat {
  turns: number[];
  dates: { turn_id: number, date: string }[];
};

type Selections = Record<number, TuiDay[]>;

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
    TuiDropdownModule,
    TuiCalendarModule,
    TuiButtonModule,
    TuiLetModule,
    FromTuiDayPipe,
    NgClass,
    DateAfterPipe
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

  readonly selections: WritableSignal<Selections> = signal({});
  readonly today: Date = new Date();

  @Input() set turns(v: ReservationTurn[]) {
    this.selections.update((selections: Selections) => {
      v.forEach(turn => {
        if (!turn.id) throw new Error('Turn id is missing');

        selections[turn.id] ||= [];
      });

      return selections;
    });
  }

  @Input() set dates(v: PreorderReservationDate[]) {
    this.selections.update((selections: Selections) => {
      v.forEach((date: PreorderReservationDate) => {
        if (!date.reservation_turn_id) throw new Error('Turn id is missing');
        if (!date.date) throw new Error('Date is missing or invalid', date.date);

        selections[date.reservation_turn_id] ||= [];
        selections[date.reservation_turn_id].push(dateToTuiDay(date.date))
      });

      return selections;
    });
  }

  private editable$ = signal(false);
  @Input() set editable(v: boolean) {
    this.editable$.set(v);
  }

  get editable(): boolean {
    return this.editable$();
  }

  @Input() set item(v: PreorderReservationGroup | null | undefined) {
    this.selections.set({});
    this.turns = v?.turns ?? [];
    this.dates = v?.dates ?? [];
  }

  private readonly allTurns = signal<ReservationTurn[]>([]);

  /**
   * allTurns grouped by weekday
   */
  readonly turnsPerDay: Signal<{ [weekday: number]: ReservationTurn[] }> = computed(() => {
    const turns: ReservationTurn[] = this.allTurns().filter(turn => turn.weekday != undefined);
    const result: { [weekday: number]: ReservationTurn[] } = {};

    for (const turn of turns) {
      if (turn.weekday == null || turn.weekday == undefined) {
        throw new Error('Turns must have a weekday');
      }

      if (this.editable$() || (turn.id && Object.keys(this.selections()).includes(turn.id.toString()))) {
        result[turn.weekday] ||= [];
        result[turn.weekday].push(turn);
      }
    }

    return result;
  });

  /**
   * Weekdays with turns
   */
  readonly weekdays: Signal<number[]> = computed(() => Object.keys(this.turnsPerDay()).map(Number));

  ngOnInit(): void {
    this.searchTurns();
  }

  triggerSelection(turnId: number) {
    this.selections.update((selections: Selections) => {
      if (turnId in selections) {
        delete selections[turnId];
      } else {
        selections[turnId] = [];
      }

      return selections;
    });

    this.emitChanges();
  }

  triggerDate(turnId: number, day: TuiDay) {
    if (!turnId) throw new Error('Invalid turn id' + turnId);
    if (!day) throw new Error('Invalid day' + day);

    this.selections.update((selections: Selections) => {
      selections[turnId] ||= [];
      const index = selections[turnId].findIndex(d => d.day === day.day);

      if (index === -1) {
        selections[turnId].push(day);
      } else {
        selections[turnId].splice(index, 1);
      }

      selections[turnId] = selections[turnId].sort((a, b) => a.dayAfter(b) ? 1 : -1);

      return selections;
    });

    this.emitChanges();
  }

  private lastOutput: TurnDateOutputFormat | null = null;
  private emitChanges(): void {
    const dates: { turn_id: number, date: string }[] = [];
    const turns: number[] = [];
    const v: Selections = this.selections();
    Object.keys(v).forEach((turnIdStr: string) => {
      const turnId: number = parseInt(turnIdStr);
      if (v[turnId].length === 0) {
        turns.push(turnId);
      } else {
        for (const day of v[turnId]) {
          const date = this.date.transform(day.toUtcNativeDate(), 'yyyy-MM-dd');
          if (date) {
            dates.push({
              turn_id: turnId,
              date: date
            });
          } else {
            console.error('Invalid date', day);
          }
        }
      }
    });

    const out: TurnDateOutputFormat = {
      dates: dates,
      turns: turns
    };

    if (this.lastOutput === null || JSON.stringify(this.lastOutput) !== JSON.stringify(out)) {
      this.outputMamiChanges.emit(out);
    }
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
