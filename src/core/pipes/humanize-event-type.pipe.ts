import {Pipe, PipeTransform} from '@angular/core';
import {ImagePixelEvent} from "@core/models/image-pixel-event";
import {ImagePixel} from "@core/models/image-pixel";
import {ImagePixelEventType} from "@core/lib/interfaces/image-pixel-data";

@Pipe({
  name: 'humanizeEventType',
  standalone: true,
  pure: true
})
export class HumanizeEventTypePipe implements PipeTransform {

  private readonly human: Record<ImagePixelEventType, string> = {
    email_open: $localize`Email aperta`
  };

  transform(value: ImagePixel['event_type'] | null | undefined): string | null {
    if (value === null || value === undefined) return null;

    return this.human[value] ?? null;
  }

}
