import {BaseModelData} from "./base-model-data";
import {ImageData} from "./image-data";

export interface TagData extends BaseModelData {
  name: string;
  description: string;
  image?: ImageData;
  status: TagStatus;
  other: Record<string, any>;
  color: string;

  translations: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }
}

export const TagStatuses = [`active`, `deleted`] as const;
export type TagStatus = typeof TagStatuses[number];