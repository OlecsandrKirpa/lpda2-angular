import {BaseModelData} from "@core/lib/interfaces/base-model-data";
import {ImagePixelEventData} from "@core/lib/interfaces/image-pixel-event-data";

export interface ImagePixelData extends BaseModelData {
  image_id?: number;
  delivered_email_id?: number;
  record_type?: string;
  record_id?: number;
  event_type?: ImagePixelEventType;
  secret?: string;

  events?: ImagePixelEventData[];
}

export const ImagePixelEventTypes = [`email_open`] as const;
export type ImagePixelEventType = typeof ImagePixelEventTypes[number];