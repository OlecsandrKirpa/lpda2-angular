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
  template: `@if((imageSrc$ | async)) { <img class="block" src="{{ (imageSrc$ | async) }}"> }`,
  styleUrls: ['./show-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowImageComponent {
  private readonly imagesService: ImagesService = inject(ImagesService);

  readonly image$: BehaviorSubject<Image | File |null> = new BehaviorSubject<Image | File | null>(null);
  @Input({ required: true }) set image(value: Image | null | undefined | File) {
    this.image$.next(value ?? null);
  }

  readonly imageSrc$: Observable<string | null> = this.image$.pipe(
    switchMap((image: Image | File | null): Observable<string | null> => {
      if (image instanceof File) {
        return of(URL.createObjectURL(image));
      }

      if (!(image && image.id)) return of(null);

      return this.imagesService.downloadUrl(image.id);
    }),
  );
}
