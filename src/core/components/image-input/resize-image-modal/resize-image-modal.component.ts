import { Component, computed, Inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { TuiButtonModule, TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent, PolymorpheusContent } from "@tinkoff/ng-polymorpheus";
import { base64ToFile, ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { Writable } from 'stream';

@Component({
  selector: 'app-resize-image-modal',
  standalone: true,
  imports: [
    ImageCropperComponent,
    TuiButtonModule,
  ],
  templateUrl: './resize-image-modal.component.html',
})
export class ResizeImageModalComponent implements OnInit {
  readonly image: WritableSignal<File | null> = signal(null);
  readonly croppedImageBase64: WritableSignal<string | null> = signal(null);

  /**
   * Settings for 'transform' property.
   */
  private readonly flipH: WritableSignal<undefined | boolean> = signal(undefined);
  private readonly flipV: WritableSignal<undefined | boolean> = signal(undefined);
  private readonly scale: WritableSignal<undefined | number> = signal(undefined);
  private readonly rotate: WritableSignal<undefined | number> = signal(undefined);
  private readonly translateH: WritableSignal<undefined | number> = signal(undefined);
  private readonly translateV: WritableSignal<undefined | number> = signal(undefined);
  private readonly translateUnit: WritableSignal<undefined | '%' | 'px'> = signal(undefined);

  readonly transform: Signal<ImageTransform> = computed((): ImageTransform => ({
    scale: this.scale(),
    rotate: this.rotate(),
    flipH: this.flipH(),
    flipV: this.flipV(),
    translateH: this.translateH(),
    translateV: this.translateV(),
    translateUnit: this.translateUnit(),
  }));

  /**
   * Settings for the cropper.
   */
  readonly containWithinAspectRatio: WritableSignal<boolean> = signal(true);
  readonly aspectRatio: WritableSignal<number> = signal(3 / 4);
  readonly cropperMinWidth: WritableSignal<number | undefined> = signal(256);
  readonly maintainAspectRatio: WritableSignal<boolean> = signal(true);
  readonly onlyScaleDown: WritableSignal<boolean> = signal(true);
  readonly roundCropper: WritableSignal<boolean> = signal(false);

  constructor(
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<Blob | null, Record<string, unknown> & { image: File }>,
  ) {
    console.log(`context`, {...context});
    this.image.set(context.data.image);
  }

  ngOnInit(): void {
    // BOOLEAN FIELDS
    (["maintainAspectRatio", "onlyScaleDown", "roundCropper", "flipH", "flipV", "containWithinAspectRatio"] as const).forEach(key => {
      const value: unknown = this.context.data[key];
      if (typeof value == 'boolean') {
        this[key].set(value);
      }
    });

    // numerical fields
    (["aspectRatio", "cropperMinWidth", "scale", "rotate", "translateH", "translateV",] as const).forEach(key => {
      const value: unknown = this.context.data[key];
      if (typeof value == 'number') {
        this[key].set(value);
      }
    });
  }

  submit(): void {
    const base64: string | null = this.croppedImageBase64();
    if (!base64) return;

    this.context.completeWith(base64ToFile(base64));
  }

  cancel(): void {
    this.context.completeWith(null);
  }

  imageCropped(event: ImageCroppedEvent) {
    if (typeof event.base64 == 'string') {
      this.croppedImageBase64.set(event.base64);
      return;
    }

    if (event.blob) {
      var reader = new FileReader();
      reader.readAsDataURL(event.blob);
      reader.onloadend = () => {
        if (typeof reader.result == "string" && reader.result.length > 0) {
          this.croppedImageBase64.set(reader.result);
          return;
        }
      }
    }
  }

  resetImage() {
    this.scale.set(undefined);
    this.rotate.set(undefined);
    this.flipH.set(undefined);
    this.flipV.set(undefined);
    this.translateH.set(undefined);
    this.translateV.set(undefined);
    this.translateUnit.set(undefined);
  }

  imageLoaded() {
    // this.showCropper.set(true);
    this.resetImage();
  }

  rotateLeft() {
    this.rotate.update((rotate) => (rotate ?? 0) - 90);
  }

  rotateRight() {
    this.rotate.update((rotate) => (rotate ?? 0) + 90);
  }

  flipHorizontal() {
    this.flipH.update((flipH) => !flipH);
  }

  flipVertical() {
    this.flipV.update((flipV) => !flipV);
  }

  zoomOut() {
    this.scale.update((scale) => (scale ?? 1) - 0.1);
  }

  zoomIn() {
    this.scale.update((scale) => (scale ?? 1) + 0.1);
  }
}
