import {ChangeDetectionStrategy, Component, computed, Inject, inject, OnInit, signal} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ImagesService} from "@core/services/http/images.service";
import {
  TuiButtonModule, TuiDataListModule,
  TuiDialogContext,
  TuiDialogService,
  TuiExpandModule,
  TuiHostedDropdownModule,
  TuiLoaderModule
} from "@taiga-ui/core";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {FormControl, ReactiveFormsModule, ValidationErrors} from "@angular/forms";
import {ImageInputComponent} from "@core/components/image-input/image-input.component";
import {NotificationsService} from "@core/services/notifications.service";
import {JsonPipe} from "@angular/common";
import {catchError, distinctUntilChanged, filter, finalize, of, Subscription, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {Image} from "@core/models/image";
import {SearchResult} from "@core/lib/search-result.model";
import {TuiReorderModule} from "@taiga-ui/addon-table";
import {TuiTilesModule} from "@taiga-ui/kit";
import {ShowImageComponent} from "@core/components/show-image/show-image.component";
import {MatIcon} from "@angular/material/icon";
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";

/**
 * Given a record_type and record_id,
 * this component will fully manage a list of images.
 * Will allow user to add, remove and reorder images.
 */
@Component({
  selector: 'app-images-edit-modal',
  standalone: true,
  imports: [
    ImageInputComponent,
    ReactiveFormsModule,
    TuiExpandModule,
    TuiButtonModule,
    JsonPipe,
    TuiLoaderModule,
    TuiTilesModule,
    ShowImageComponent,
    MatIcon,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    TuiHostedDropdownModule,
    TuiDataListModule,
  ],
  templateUrl: './images-edit-modal.component.html',
  styleUrl: './images-edit-modal.component.scss',
  providers: [
    TuiDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagesEditModalComponent implements OnInit {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly service: ImagesService = inject(ImagesService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly newImage: FormControl = new FormControl(null);
  readonly data = signal<SearchResult<Image> | null>(null);
  readonly images = computed(() => this.data()?.items ?? []);

  readonly reordering = signal<boolean>(false);
  readonly removing = signal<boolean>(false);
  readonly savingImage = signal<boolean>(false);
  readonly loadingImages = signal<boolean>(false);

  readonly loading = computed(() => this.loadingImages() || this.savingImage() || this.removing() || this.reordering());

  readonly contextData: { record_type: string, record_id: number } | null = this.context.data ?? null;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      null,
      /**
       * Taking in input record_type and record_id in order to be as generic as possible.
       */
      { record_type: string, record_id: number }
    >,
  ) {
  }

  ngOnInit(): void {
    this.loadImages();

    this.newImage.valueChanges.pipe(
      takeUntil(this.destroy$),
      catchError(() => of(null)),
      distinctUntilChanged(),
      filter((v: File | null) => v !== null && v !== undefined),
    ).subscribe({
      next: () => this.saveNewImage(),
    });
  }

  private reorderSub?: Subscription;

  drop(event: CdkDragDrop<Image[]>) {
    let images = this.images();
    moveItemInArray(images, event.previousIndex, event.currentIndex);
    if (!(this.contextData && this.contextData.record_type && this.contextData.record_id)) return;
    this.reorderSub?.unsubscribe();
    const ids: number[] = this.images().map((i: Image) => i.id).filter((i: number | null | undefined): i is number => typeof i === 'number' && Number(i) > 0);

    this.reordering.set(true);
    this.reorderSub = this.service.updateRecord(this.contextData, ids).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.reordering.set(false)),
    ).subscribe({
      next: () => {
        this.loadImages();
      },
      error: (r: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto.`);
      }
    })
  }

  private removeSub?: Subscription;

  removeImage(image: Image): void {
    const id = image.id;
    if (!(id && id > 0)) return;
    if (!(this.contextData && this.contextData.record_type && this.contextData.record_id)) return;

    this.removeSub?.unsubscribe();

    this.removing.set(true);
    this.removeSub = this.service.removeFromRecord(id, this.contextData).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.removing.set(false)),
    ).subscribe({
      next: () => {
        this.loadImages();
      },
      error: (r: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto.`);
      }
    });
  }

  cancel() {
    this.context.completeWith(null);
  }

  // remove()

  private uploadSub?: Subscription;

  saveNewImage(): void {
    this.uploadSub?.unsubscribe();

    this.savingImage.set(true);
    this.uploadSub = this.service.create(this.newImageFormData()).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.savingImage.set(false)),
    ).subscribe({
      next: (data: Image) => {
        this.newImage.setValue(null);
        this.loadImages();
      },
      error: (r: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto.`);
      }
    });
  }

  private loadSub?: Subscription;

  private loadImages(): void {
    if (!(this.contextData && this.contextData.record_type && this.contextData.record_id)) return;

    this.loadSub?.unsubscribe();

    this.loadingImages.set(true);
    this.service.search({record_type: this.contextData.record_type, record_id: this.contextData.record_id}).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingImages.set(false)),
    ).subscribe({
      next: (data) => {
        this.data.set(data);
      },
      error: (r: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto.`);
      }
    });
  }

  private newImageFormData(): FormData {
    if (!(this.contextData && this.contextData.record_type && this.contextData.record_id)) throw new Error(`Invalid context data.`);
    if (!this.newImage.valid && this.newImage.value) throw new Error(`Invalid new image.`);

    const formData: FormData = new FormData();

    formData.append('image', this.newImage.value);
    formData.append('record_type', this.contextData?.record_type);
    formData.append('record_id', this.contextData?.record_id?.toString());

    return formData;
  }
}
