import { ChangeDetectionStrategy, Component, Inject, signal, WritableSignal } from '@angular/core';
import { MenuCategory } from '@core/models/menu-category';
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import { ShowImagesComponent } from "../../../show-images/show-images.component";
import { ShowImageComponent } from "../../../show-image/show-image.component";

@Component({
  selector: 'app-menu-category-select-option',
  standalone: true,
  imports: [ShowImageComponent],
  templateUrl: './menu-category-select-option.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuCategorySelectOptionComponent {
  readonly item: WritableSignal<MenuCategory | null> = signal(null);

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: Record<any, any>,
  ) {
    const data: unknown = context['data'];
    if (data && data instanceof MenuCategory){
      this.item.set(data);
    }else{
      console.warn("invalid category. Please provide parm 'data' to context.", data);
    }
  }
}
