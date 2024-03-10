import {BaseModelData} from "./base-model-data";

export interface ImageData extends BaseModelData {
  filename?: string;
  title?: string; // Translated short description of the image.
  description?: string; // Translated long description of the image.
  status?: ImageStatus;
}

export const ImageStatuses = [`active`, `deleted`] as const;
export type ImageStatus = typeof ImageStatuses[number];