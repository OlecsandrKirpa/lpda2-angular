import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MenuCategory} from "@core/models/menu-category";
import {CommonItemStatus} from "@core/components/statuses/common-item.status";
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-menu-category-status',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './menu-category-status.component.html',
  styleUrl: './menu-category-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["status"]
})
export class MenuCategoryStatusComponent extends CommonItemStatus {
  // @Input() status: MenuCategory['status'] | null = null;

  protected override readonly configs: { [key: string]: { text: string, color: string, icon: string, description: string } } = {
    active: { text: $localize`Attivo`, color: 'var(--tui-positive, lime)', icon: 'check', description: $localize`Il progetto è attivo.` },
    deleted: { text: $localize`Eliminato`, color: 'red', icon: 'trash', description: $localize`Il progetto è stato eliminato.` },
  }
}
