import {ChangeDetectionStrategy, Component, Inject, inject} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ImagesService} from "@core/services/http/images.service";
import {TuiDialogContext, TuiDialogService} from "@taiga-ui/core";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {FormControl, ReactiveFormsModule, ValidationErrors} from "@angular/forms";
import {ImageInputComponent} from "@core/components/image-input/image-input.component";

@Component({
  selector: 'app-images-edit-modal',
  standalone: true,
  imports: [
    ImageInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './images-edit-modal.component.html',
  providers: [
    TuiDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagesEditModalComponent {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly service: ImagesService = inject(ImagesService);
  readonly image: FormControl = new FormControl(null);


  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<null | any, any>,
  ) {
  }


  save(): void {
    // TODO send changes to the server though this.service.
    this.context.completeWith(true);
  }

  cancel() {
    this.context.completeWith(null);
  }
}
