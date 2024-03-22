import {ChangeDetectionStrategy, Component, inject, Injector, Input} from '@angular/core';
import {Image} from "@core/models/image";
import {TuiCarouselModule, TuiIslandModule, TuiMarkerIconModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiDialogService, TuiLoaderModule} from "@taiga-ui/core";
import {ShowImageComponent} from "@core/components/show-image/show-image.component";
import {MatIcon} from "@angular/material/icon";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import {ImagesEditModalComponent} from "@core/components/show-images/images-edit-modal/images-edit-modal.component";

@Component({
  selector: 'app-show-images',
  standalone: true,
  imports: [
    TuiCarouselModule,
    TuiButtonModule,
    TuiIslandModule,
    TuiLoaderModule,
    TuiMarkerIconModule,
    ShowImageComponent,
    MatIcon
  ],
  templateUrl: './show-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
  ]
})
export class ShowImagesComponent {
  private readonly dialogs: TuiDialogService = inject(TuiDialogService);
  private readonly injector: Injector = inject(Injector);
  @Input({required: true}) images: (Image | File)[] | undefined | null = [];
  @Input({required: true}) recordType?: "Menu::Category" | "Menu::Dish";
  @Input({required: true}) recordId?: number;
  index: number = 0;

  showDetails(): void {
    this.dialogs.open<any>(
      new PolymorpheusComponent(ImagesEditModalComponent, this.injector),
      {
        data: { record_type: this.recordType, record_id: this.recordId },
        dismissible: false,
        label: $localize`Modifica immagini`,
      },
    ).subscribe({
      next: (data) => {},
      error: (data: any) => {
        console.warn(`completed with error`, data)
      },
      complete: () => {
      },
    });
  }
}
