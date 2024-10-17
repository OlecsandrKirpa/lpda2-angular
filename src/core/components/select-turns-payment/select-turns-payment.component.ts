import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, OnChanges, OnInit, Output, Signal, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ReservationTurn } from '@core/models/reservation-turn';
import { TuiDestroyService, tuiPure } from '@taiga-ui/cdk';
import { WeekdayPipe } from "../../pipes/weekday.pipe";
import { TuiCheckboxBlockModule, TuiLazyLoadingModule } from '@taiga-ui/kit';
import { ReservationTurnsService } from '@core/services/http/reservation-turns.service';
import { catchError, finalize, map, Observable, of, takeUntil } from 'rxjs';
import { SearchResult } from '@core/lib/search-result.model';
import { date } from 'joi';
import { TuiLoaderModule } from '@taiga-ui/core';
import { DatePipe } from '@angular/common';

interface Turn extends ReservationTurn {
  selected?: boolean;
}

/**
 * This component:
 * Will be used in two similar contexts:
 * When selecting turns for a PreorderReservationGroup, where:
 * - Is always required a payment if reservation is in that turn
 * - Payment is required for that turn only for specific dates.
 */
@Component({
  selector: 'app-select-turns-payment',
  standalone: true,
  imports: [
    WeekdayPipe,
    TuiCheckboxBlockModule,
    FormsModule,
    TuiLoaderModule,
    DatePipe,
  ],
  templateUrl: './select-turns-payment.component.html',
  styleUrl: './select-turns-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectTurnsPaymentComponent,
      multi: true
    }
  ]
})
export class SelectTurnsPaymentComponent implements ControlValueAccessor, OnChanges, OnInit {
  private readonly turnsService: ReservationTurnsService = inject(ReservationTurnsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  /**
   * Will be provided by the parent component.
   * When blank, the component will work as the turns will be added to the PreorderReservationGroup without any date.
   * Otherwise specify all the dates selected in the calendar; this component will take care of the rest.
   */
  @Input() dates: Date[] | null = null;

  readonly loading: WritableSignal<boolean> = signal(false);

  /**
   * All the turns available for the week (or days in this.dates)
   */
  readonly turns: WritableSignal<Turn[]> = signal([]);

  /**
   * Turns grouped by weekday
   */
  readonly turnsPerDay: Signal<{ [weekday: number]: Turn[] }> = computed(() => {
    const turns: ReservationTurn[] = this.turns().filter(turn => turn.weekday != undefined);
    const result: { [weekday: number]: Turn[] } = {};

    for (const turn of turns) {
      if (turn.weekday == null || turn.weekday == undefined) {
        throw new Error('Turns must have a weekday');
      }

      if (!result[turn.weekday]) result[turn.weekday] = [];
      result[turn.weekday].push(turn);
    }

    return result;
  });

  /**
   * Weekdays with turns
   */
  readonly weekdays: Signal<number[]> = computed(() => Object.keys(this.turnsPerDay()).map(Number));

  readonly disabled = signal(false);

  private readonly changes$ = new EventEmitter<ReservationTurn[]>();

  ngOnInit(): void {
    this.updateTurnsAccordingToDates();
  }

  ngOnChanges(ch: SimpleChanges): void {
    if (ch["dates"]) {
      this.updateTurnsAccordingToDates();
    }
  }

  registerOnChange(fn: any): void {
    this.changes$.subscribe({ next: (d: unknown) => fn(d) });
  }

  registerOnTouched(fn: any): void {
    this.changes$.subscribe(() => fn());
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  private wroteSelected: number[] = [];
  writeValue(obj: unknown): void {
    if (!Array.isArray(obj)) obj = [obj];

    this.selectIds(
      (obj as unknown[]).filter((turn: unknown): turn is ReservationTurn => turn instanceof ReservationTurn).map(turn => turn.id).filter((id: unknown): id is number => typeof id === "number" && id > 0)
    );
  }

  updateSelection(turn: Turn, selected: boolean) {
    this.turns.update(turns => {
      const index = turns.findIndex(t => t.id === turn.id);
      if (index === -1) return turns;

      turns[index].selected = (selected === true);
      return turns;
    });

    this.checkAndTriggerChanges();
  }

  @tuiPure
  datesForWeekday(weekday: number): Date[] {
    return this.dates?.filter(date => date.getDay() === weekday) ?? [];
  }

  private checkAndTriggerChanges(): void {
    const selectedTurns = this.turns().filter(turn => turn.selected);

    this.changes$.emit(selectedTurns);
  }

  /**
   * Will set turns to the provided value but will keep the selected state of the turns.
   */
  private setTurns(turns: ReservationTurn[]): void {
    const selectedTurnIds: number[] = this.turns().filter(turn => turn.selected).map(turn => turn.id).filter((id: unknown): id is number => typeof id === "number" && id > 0);
    this.turns.set(turns);
    this.selectIds(selectedTurnIds);
  }

  private selectIds(ids: number[]): void {
    if (this.turns().length == 0) {
      this.wroteSelected = ids;
      return;
    }

    this.turns.update(turns => turns.map(turn => {
      turn.selected = typeof turn.id === "number" && ids.includes(turn.id);
      return turn;
    }));
  }

  private updateTurnsAccordingToDates(): void {
    this.searchTurns().subscribe({
      next: (data: ReservationTurn[]) => {
        const dateWeekday: (number | undefined)[] = this.dates?.map(date => date.getDay()) ?? [];

        this.setTurns(
          dateWeekday.length > 0 ? data.filter(turn => dateWeekday.includes(turn.weekday)) : data
        );

        if (this.wroteSelected && this.wroteSelected.length > 0) {
          this.turns.update(turns => turns.map(turn => {
            if (turn.id && this.wroteSelected.includes(turn.id)) turn.selected = true;
            return turn;
          }));

          this.wroteSelected = [];
        }

        this.checkAndTriggerChanges();
      }
    });
  }

  private searchTurns(): Observable<ReservationTurn[]> {
    this.loading.set(true);
    return this.turnsService.search({
      per_page: 1000
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
      map((data: SearchResult<ReservationTurn>) => data.items),
      catchError((error: unknown) => {
        console.error(error);
        return of([]);
      })
    );
  }
}
