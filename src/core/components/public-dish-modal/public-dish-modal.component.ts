import { ChangeDetectionStrategy, Component, Inject, signal, WritableSignal } from '@angular/core';
import {POLYMORPHEUS_CONTEXT, PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import {
  TuiButtonModule,
  TuiDialogContext,
  TuiDialogService,
  TuiExpandModule,
  TuiLinkModule,
  TuiLoaderModule
} from "@taiga-ui/core";
import { Dish } from '@core/models/dish';

@Component({
  selector: 'app-public-dish-modal',
  standalone: true,
  imports: [],
  templateUrl: './public-dish-modal.component.html',
  styleUrl: './public-dish-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicDishModalComponent {

  readonly dish: WritableSignal<Dish | null> = signal(null);

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<null, { dish: Dish }>,
  ) {
    // console.log("PublicDishModalComponent", {context: this.context});
    this.dish.set(this.context.data.dish);
  }

}
