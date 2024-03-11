import {BaseModelData} from "./base-model-data";

export interface ImageData extends BaseModelData {
  filename?: string;
  key?: string;
  original_id?: number;
  tag?: string;
  url?: string;
  status?: ImageStatus;
}

export const ImageStatuses = [`active`, `deleted`] as const;
export type ImageStatus = typeof ImageStatuses[number];