import {ChangeDetectionStrategy, Component, forwardRef, inject} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {
  CommonDynamicSelectComponentInputs,
  CommonDynamicSelectComponentOutputs,
  CommonDynamicSelectModuleImports
} from "@core/components/dynamic-selects/common-dynamic-select/common-dynamic-select";
import {ReservationTurn} from "@core/models/reservation-turn";
import {ReservationTurnsService} from "@core/services/http/reservation-turns.service";
import {
  CommonDynamicSelectComponent
} from "@core/components/dynamic-selects/common-dynamic-select/common-dynamic-select.component";
import { WeekdayPipe } from '@core/pipes/weekday.pipe';

@Component({
  templateUrl: `../common-dynamic-select/common-dynamic-select.component.html`,
  selector: 'app-reservation-turn-select',
  styleUrls: [`../common-dynamic-select/common-dynamic-select.component.scss`],
  inputs: CommonDynamicSelectComponentInputs,
  outputs: CommonDynamicSelectComponentOutputs,
  imports: CommonDynamicSelectModuleImports,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReservationTurnSelectComponent),
      multi: true
    },

    TuiDestroyService,
    WeekdayPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationTurnSelectComponent extends CommonDynamicSelectComponent<ReservationTurn> {

  private readonly weekday = inject(WeekdayPipe);

  override stringify = (c: ReservationTurn): string => `${c.name} (${c.starts_at} - ${c.ends_at}, ${this.weekday.transform(c.weekday)})`;

  override readonly service: ReservationTurnsService = inject(ReservationTurnsService);

  constructor() {
    super();
  }
}
