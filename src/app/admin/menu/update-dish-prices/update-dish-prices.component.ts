import { ChangeDetectionStrategy, Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DishesService } from '@core/services/http/dishes.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiExpandModule, TuiGroupModule, TuiLinkModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputNumberModule, TuiRadioBlockModule, TuiRadioModule, TuiSelectModule } from '@taiga-ui/kit';
import { finalize, takeUntil } from 'rxjs';
import { ErrorsComponent } from "../../../../core/components/errors/errors.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-update-dish-prices',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiButtonModule,
    TuiGroupModule,
    TuiSelectModule,
    TuiRadioBlockModule,
    TuiRadioModule,
    TuiTextfieldControllerModule,
    ErrorsComponent,
    TuiExpandModule,
    TuiInputNumberModule,
    TuiLinkModule,
    RouterModule,
],
  templateUrl: './update-dish-prices.component.html',
  styleUrl: './update-dish-prices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class UpdateDishPricesComponent {
  private readonly destroy$ = inject(TuiDestroyService);
  private readonly service = inject(DishesService);
  private readonly notifications = inject(NotificationsService);

  private readonly submitting: WritableSignal<boolean> = signal<boolean>(false);
  readonly loading = computed(() => this.submitting());

  // absoluteValue: boolean = false;

  readonly form: FormGroup<{ amount: FormControl<null | number>, percent: FormControl<null | number>, isAbsolute: FormControl<boolean | null> }> = new FormGroup({
    amount: new FormControl<null | number>(null, []),
    percent: new FormControl<null | number>(null, [Validators.min(-100)]),
    isAbsolute: new FormControl<null | boolean>(false)
  });

  submit(): void {
    const { amount, percent } = this.form.value;
    if (this.form.invalid || ((amount == null || amount == 0) && (percent == null || percent == 0))) {
      this.notifications.error();
      return;
    }

    let obj: { amount: number } | { percent: number } | null = null;
    if (typeof amount == 'number' && amount != 0) obj = { amount };
    if (typeof percent == 'number' && percent != 0) obj = { percent };

    if (obj == null) {
      this.notifications.error();
      return;
    }

    this.submitting.set(true);
    this.service.updatePrices(obj).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.submitting.set(false))
    ).subscribe(() => {
      this.notifications.success($localize`Prezzi aggiornati`);
      this.form.reset();
    })
  }
}
