import {BaseModel} from "@core/lib/base-model";
import {ImagePixelData, ImagePixelEventType} from "@core/lib/interfaces/image-pixel-data";
import {ImagePixelEvent} from "@core/models/image-pixel-event";

export class ImagePixel extends BaseModel {
  image_id?: number;
  delivered_email_id?: number;
  record_type?: string;
  record_id?: number;
  event_type?: ImagePixelEventType;
  secret?: string;

  events?: ImagePixelEvent[];

  constructor(data: ImagePixelData) {
    super(data);

    this.image_id = data.image_id;
    this.delivered_email_id = data.delivered_email_id;
    this.record_type = data.record_type;
    this.record_id = data.record_id;
    this.event_type = data.event_type;
    this.secret = data.secret;

    this.events = data.events ? data.events.map((data) => new ImagePixelEvent(data)) : [];
  }
}