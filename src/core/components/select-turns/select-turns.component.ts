import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, EventEmitter, forwardRef, inject, Input, OnChanges, OnInit, Output, Signal, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
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


@Component({
  selector: 'app-select-turns',
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
    DateAfterPipe,
    JsonPipe,
  ],
  templateUrl: './select-turns.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectTurnsComponent)
    },

    TuiDestroyService,
  ]
})
export class SelectTurnsComponent implements ControlValueAccessor {

  private readonly turnsService: ReservationTurnsService = inject(ReservationTurnsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly date: DatePipe = inject(DatePipe);

  @Output() selectionsChanges = new EventEmitter<ReservationTurn[]>();

  readonly loading: WritableSignal<boolean> = signal(false);

  readonly selections: WritableSignal<number[]> = signal<number[]>([]);
  // readonly today: Date = new Date();

  // @Input() set turns(v: ReservationTurn[]) {
  //   this.selections.update((selections: Selections) => {
  //     v.forEach(turn => {
  //       if (!turn.id) throw new Error('Turn id is missing');

  //       selections[turn.id] ||= [];
  //     });

  //     return selections;
  //   });
  // }

  // @Input() set dates(v: PreorderReservationDate[]) {
  //   this.selections.update((selections: Selections) => {
  //     v.forEach((date: PreorderReservationDate) => {
  //       if (!date.reservation_turn_id) throw new Error('Turn id is missing');
  //       if (!date.date) throw new Error('Date is missing or invalid', date.date);

  //       selections[date.reservation_turn_id] ||= [];
  //       selections[date.reservation_turn_id].push(dateToTuiDay(date.date))
  //     });

  //     return selections;
  //   });
  // }

  // private editable$ = signal(false);
  // @Input() set editable(v: boolean) {
  //   this.editable$.set(v);
  // }

  // get editable(): boolean {
  //   return this.editable$();
  // }

  // @Input() set item(v: PreorderReservationGroup | null | undefined) {
  //   this.selections.set({});
  //   this.turns = v?.turns ?? [];
  //   this.dates = v?.dates ?? [];
  // }

  readonly disabled: WritableSignal<boolean> = signal<boolean>(false);

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

      // if (this.editable$() || (turn.id && Object.keys(this.selections()).includes(turn.id.toString()))) {
        result[turn.weekday] ||= [];
        result[turn.weekday].push(turn);
      // }
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

  writeValue(obj: unknown[]): void {
    if (!Array.isArray(obj)) obj = [obj];

    obj = obj.filter((k: unknown) => k != null && k != undefined);

    const ids: number[] = [];
    obj.forEach((k: unknown) => {
      if (k instanceof ReservationTurn && k.id) ids.push(k.id);
      else if (typeof k === "number") ids.push(k);
      else if (typeof k === "object" && k != null && Object.keys(k).includes("id") && typeof (k as any)["id"] === "number") ids.push((k as any)["id"]);
      else console.warn("invalid object provided to SelectTurnsComponent", obj);
    });

    this.selections.set(ids);
  }

  registerOnChange(fn: any): void {
    this.selectionsChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.selectionsChanges.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  triggerSelection(turnId: number) {
    this.selections.update((selections: number[]) => {
      const index = selections.indexOf(turnId);
      if (index != -1){
        selections.splice(index, 1);
      } else {
        selections.push(turnId);
      }

      return selections;
    });

    this.emitChanges();
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

  private emitChanges(): void {
    this.selectionsChanges.emit(
      this.allTurns().filter((v: ReservationTurn) => typeof v.id === "number" && this.selections().includes(v.id))
    )
  }
}
