import {BaseModel} from "@core/lib/base-model";
import {ImagePixelEventData} from "@core/lib/interfaces/image-pixel-event-data";

export class ImagePixelEvent extends BaseModel {
  image_pixel_id?: number;
  event_data?: Record<string, any>;
  event_time?: Date;

  constructor(data: ImagePixelEventData) {
    super(data);

    this.image_pixel_id = data.image_pixel_id;
    this.event_data = data.event_data;
    this.event_time = data.event_time ? new Date(data.event_time) : undefined;
  }
}