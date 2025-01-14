import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef, inject,
  Injector,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
import { TuiInputFilesModule, TuiInputModule } from "@taiga-ui/kit";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TuiDestroyService } from "@taiga-ui/cdk";
import { TuiButtonModule, TuiDialogService, TuiHintModule } from "@taiga-ui/core";
import { MatIcon } from "@angular/material/icon";
import { takeUntil } from "rxjs";
import { Image } from "@core/models/image";
import { DomainService } from "@core/services/domain.service";
import { ImagesService } from "@core/services/http/images.service";
import { ShowImageComponent } from "@core/components/show-image/show-image.component";
import { NotificationsService } from '@core/services/notifications.service';
import { ResizeImageModalComponent } from './resize-image-modal/resize-image-modal.component';
import { PolymorpheusContent, PolymorpheusComponent } from "@tinkoff/ng-polymorpheus";
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiInputFilesModule,
    ReactiveFormsModule,
    TuiButtonModule,
    MatIcon,
    ShowImageComponent,
    TuiHintModule,
  ],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageInputComponent),
      multi: true
    },

    TuiDestroyService,
  ],
})
export class ImageInputComponent implements OnInit, ControlValueAccessor {
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly dialogs: TuiDialogService = inject(TuiDialogService);
  private readonly injector: Injector = inject(Injector);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly imagesService: ImagesService = inject(ImagesService);

  readonly control: FormControl<Blob | null> = new FormControl<Blob | null>(null);

  @Input() showBorder: boolean = true;

  @Input() loading: boolean = false;

  @Input() link: string = $localize`Scegli un'immagine`;

  @Input() label: string = $localize`oppure trascinala qui`;

  @Input() accept: string = "image/*";

  /**
   * Some settings may be ignored. Check ResizeImageModalComponent to see which settings are actually used.
   */
  @Input() cropperSettings: Record<string, unknown> | null | undefined = null;

  @Output() readonly imageChange = new EventEmitter<unknown>();

  readonly isFileUploaded: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.control.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (value: Blob | null) => {
        if (value instanceof File) {
          this.fireResizeModal();
          this.isFileUploaded.set(true);
        }
      }
    });
  }

  registerOnChange(fn: any): void {
    this.imageChange.pipe(
      takeUntil(this.destroy$),
    ).subscribe({ next: (value) => fn(value) });
  }

  registerOnTouched(fn: any): void {
    this.imageChange.pipe(
      takeUntil(this.destroy$),
    ).subscribe({ next: () => fn() });
  }

  writeValue(obj: unknown): any {
    const complete = () => {
      this.isFileUploaded.set(false);
    };

    if (obj instanceof File) {
      this.control.setValue(obj);
      return complete();
    }

    if (obj === null || obj === undefined) {
      this.control.setValue(null);
      return complete();
    }

    if (obj instanceof Image && obj.id) {
      return this.imagesService.downloadUrl(obj.id).subscribe({
        next: (url: string) => {
          fetch(url).then((res: Response) => res.blob()) // Gets the response and returns it as a blob
            .then((blob: Blob) => {
              this.control.setValue(blob, { emitEvent: false });
              complete();
            });
        }
      })
    }

    this.control.setValue(null);
    complete();

    console.warn(`Invalid value for ImageInputComponent`, obj);
  }

  resetControl(): void {
    this.control.reset();
  }

  emit(blob: Blob | null): void {
    this.imageChange.emit(blob);
  }

  fireResizeModal(): void {
    const file = this.control.value;
    if (!file) return;

    this.dialogs.open<Blob | null>(
      new PolymorpheusComponent(ResizeImageModalComponent, this.injector),
      {
        size: 'l',
        closeable: true,
        dismissible: true,
        data: {
          ...(this.cropperSettings || {}),
          image: file
        },
      }
    ).subscribe({
      next: (result: Blob | null) => {
        if (result) {
          this.emit(result);
        }
        // else {
        //   this.control.setValue(null, { emitEvent: true });
        // }
      },
      error: (err: any) => {
        this.notifications.error(SOMETHING_WENT_WRONG_MESSAGE);
      }
    })
  }
}
