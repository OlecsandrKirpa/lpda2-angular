import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {Image} from "@core/models/image";
import {ImagesService} from "@core/services/http/images.service";
import {BehaviorSubject, Observable, of, startWith, switchMap} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-show-image',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  template: `@if((imageSrc$ | async)) { <img [draggable]="false" class="{{ imgClass }}" src="{{ (imageSrc$ | async) }}"> }`,
  styleUrls: ['./show-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowImageComponent {
  private readonly noImage: string = `/assets/img/no-image.jpg`;
  private readonly imagesService: ImagesService = inject(ImagesService);

  @Input() imgClass: string = `block rounded`;

  readonly image$: BehaviorSubject<Image | Blob |null> = new BehaviorSubject<Image | Blob | null>(null);
  @Input({ required: true }) set image(value: Image | null | undefined | Blob) {
    this.image$.next(value ?? null);
  }

  readonly imageSrc$: Observable<string | null> = this.image$.pipe(
    switchMap((image: Image | Blob | null): Observable<string | null> => {
      if (image instanceof Blob) {
        return of(URL.createObjectURL(image));
      }

      if (!(image && image.id)) return of(this.noImage);

      return this.imagesService.downloadUrl(image.id);
    }),
  );
}
