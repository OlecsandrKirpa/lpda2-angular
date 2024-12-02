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
import {MenuCategory} from "@core/models/menu-category";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import { PolymorpheusModule, PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { MenuCategorySelectOptionComponent } from './menu-category-select-option/menu-category-select-option.component';

@Component({
  templateUrl: `../common-dynamic-select/common-dynamic-select.component.html`,
  selector: 'app-menu-category-select',
  styleUrls: [`../common-dynamic-select/common-dynamic-select.component.scss`],
  inputs: CommonDynamicSelectComponentInputs,
  outputs: CommonDynamicSelectComponentOutputs,
  imports: CommonDynamicSelectModuleImports,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MenuCategorySelectComponent),
      multi: true
    },

    TuiDestroyService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuCategorySelectComponent extends CommonDynamicSelectComponent<MenuCategory> {

  override stringify = (c: MenuCategory): string => c.name ?? ``;

  override readonly service: MenuCategoriesService = inject(MenuCategoriesService);

  constructor() {
    super();

    this.nativeOptionTemplate$.set(new PolymorpheusComponent(MenuCategorySelectOptionComponent));
  }
}
