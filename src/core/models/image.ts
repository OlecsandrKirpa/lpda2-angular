import {BaseModel} from "../lib/base-model";
import {ImageData, ImageStatus} from "../lib/interfaces/image-data";

export class Image extends BaseModel {
  filename?: string;
  title?: string; // Translated short description of the image.
  description?: string; // Translated long description of the image.
  status?: ImageStatus;

  constructor(data: ImageData) {
    super(data);

    this.filename    = data.filename;
    this.title       = data.title;
    this.description = data.description;
    this.status      = data.status;
  }
}