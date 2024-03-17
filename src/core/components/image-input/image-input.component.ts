import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef, inject,
  Input,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import {TuiInputFilesModule, TuiInputModule} from "@taiga-ui/kit";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {$localize} from "@angular/localize/init";
import {TuiButtonModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {takeUntil} from "rxjs";
import {Image} from "@core/models/image";
import {DomainService} from "@core/services/domain.service";
import {ImagesService} from "@core/services/http/images.service";
import {ShowImageComponent} from "@core/components/show-image/show-image.component";

/**
 * TODO:
 * - manage multiple images
 * - take in input the accepted file types
 * - check if svg works (it should work.)
 * - implement the writeValue method
 */

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
export class ImageInputComponent implements ControlValueAccessor, OnInit {
  private readonly destroy$: TuiDestroyService = new TuiDestroyService();
  private readonly imagesService: ImagesService = inject(ImagesService);

  readonly control: FormControl = new FormControl<File | null>(null);

  // readonly imageUrl: WritableSignal<string | null> = signal(null);

  @Input() link: string = $localize`Scegli un'immagine`;

  @Input() label: string = $localize`oppure trascinala qui`;

  ngOnInit(): void {
    // this.control.valueChanges.pipe(
    //   takeUntil(this.destroy$),
    // ).subscribe({
    //   next: (value: File | null) => {
    //     this.imageUrl.set(value ? this.formatUrlFromFile(value) : null);
    //   }
    // })
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe({next: (value) => fn(value)});
  }

  registerOnTouched(fn: any): void {
    this.control.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe({next: () => fn()});
  }

  writeValue(obj: unknown): void {
    if (obj instanceof File) {
      this.control.setValue(obj);
      return;
    }

    if (obj === null || obj === undefined) {
      this.control.setValue(null);
      return;
    }

    if (obj instanceof Image && obj.url) {
      this.control.setValue(obj, { emitEvent: false });
      // this.control.setValue(null, {emitEvent: false});
      // this.imagesService.downloadUrl(obj.id!).subscribe({
      //   next: (url: string) => {
      //     this.imageUrl.set(url);
      //   },
      // })
      // this.imageUrl.set(obj.url);
      return;
    }

    console.warn(`Invalid value for ImageInputComponent`, obj);
  }

  resetControl(): void {
    this.control.reset();
  }

  private formatUrlFromFile(file: File): string {
    return URL.createObjectURL(file);
  }
}
