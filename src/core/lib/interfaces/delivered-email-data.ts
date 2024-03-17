import {BaseModelData} from "@core/lib/interfaces/base-model-data";
import {ImagePixelData} from "@core/lib/interfaces/image-pixel-data";

export interface DeliveredEmailData extends BaseModelData {
  record_id?: number;
  record_type?: string;
  text?: string;
  html?: string;
  subject?: string;
  headers?: Record<string, any>;
  raw?: string;

  image_pixels?: ImagePixelData[];
}