import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonItemStatus} from "@core/components/statuses/common-item.status";
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-dish-status',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './dish-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["status"]
})
export class DishStatusComponent extends CommonItemStatus {
  // @Input() status: MenuCategory['status'] | null = null;

  protected override readonly configs: { [key: string]: { text: string, color: string, icon: string } } = {
    active: {text: $localize`Attivo`, color: 'var(--tui-positive, lime)', icon: 'check'},
    inactive: {text: $localize`Inattivo`, color: 'var(--tui-negative, red)', icon: 'close'},
    deleted: {text: $localize`Eliminato`, color: 'red', icon: 'trash'},
  }
}
