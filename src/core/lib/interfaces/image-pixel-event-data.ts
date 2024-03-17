import {BaseModelData} from "@core/lib/interfaces/base-model-data";

export interface ImagePixelEventData extends BaseModelData {
  image_pixel_id?: number;
  event_data?: Record<string, any>;
  event_time?: string; // datetime
}