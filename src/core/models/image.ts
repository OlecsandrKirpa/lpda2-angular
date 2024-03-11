import {BaseModel} from "../lib/base-model";
import {ImageData, ImageStatus} from "../lib/interfaces/image-data";

export class Image extends BaseModel {
  filename?: string;
  status?: ImageStatus;
  key?: string;
  original_id?: number;
  tag?: string;
  url?: string;

  constructor(data: ImageData) {
    super(data);

    this.filename = data.filename;
    this.status = data.status;
    this.key = data.key;
    this.original_id = data.original_id;
    this.tag = data.tag;
    this.url = data.url;
  }

  // genFile(): File | null {
  //   if (!(this.url)) return null;
  //   if (!(this.filename)) return null;
  //
  //   return new File([new Blob([this.url])], this.filename, { type: 'image/jpeg' });
  // }
}