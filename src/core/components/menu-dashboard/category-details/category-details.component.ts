import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
import {MenuCategory} from "@core/models/menu-category";
import {ShowImagesComponent} from "@core/components/show-images/show-images.component";
import {
  EipCategoryVisibilityComponent
} from "@core/components/eip-category-visibility/eip-category-visibility.component";
import {NameDescEipComponent} from "@core/components/name-desc-eip/name-desc-eip.component";
import {TuiButtonModule, TuiExpandModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import {NotificationsService} from "@core/services/notifications.service";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [
    ShowImagesComponent,
    EipCategoryVisibilityComponent,
    NameDescEipComponent,
    TuiExpandModule,
    TuiButtonModule,
    MatIcon,
    NgClass
  ],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class CategoryDetailsComponent {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly service: MenuCategoriesService = inject(MenuCategoriesService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  @Output() categoryChange: EventEmitter<MenuCategory> = new EventEmitter<MenuCategory>();
  @Input({required: true}) category: MenuCategory | null = null;
  expanded: boolean = true;

  readonly loading: WritableSignal<boolean> = signal(false);

  saveNameDesc(event: {name: Record<string, string>; description: Record<string, string>}) {
    const id = this.category?.id;
    if (!id) return;

    this.loading.set(true);
    this.service.update(id, event).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (item: MenuCategory) => {
        this.notifications.fireSnackBar($localize`Traduzioni aggiornate.`)
        this.categoryChange.emit(item);
        this.category = item;
      },
      error: (r: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto.`);
      }
    })
  }
}
