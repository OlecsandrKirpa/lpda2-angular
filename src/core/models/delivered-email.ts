import {BaseModel} from "@core/lib/base-model";
import {DeliveredEmailData} from "@core/lib/interfaces/delivered-email-data";
import {ImagePixel} from "@core/models/image-pixel";

export class DeliveredEmail extends BaseModel {
  record_id?: number;
  record_type?: string;
  text?: string;
  html?: string;
  subject?: string;
  headers?: Record<string, any>;
  raw?: string;

  image_pixels?: ImagePixel[];

  constructor(data: DeliveredEmailData) {
    super(data);

    this.record_id = data.record_id;
    this.record_type = data.record_type;
    this.text = data.text;
    this.html = data.html;
    this.subject = data.subject;
    this.headers = data.headers;
    this.raw = data.raw;

    this.image_pixels = data.image_pixels ? data.image_pixels.map((data) => new ImagePixel(data)) : [];
  }
}