import {BaseModelData} from "./base-model-data";
import {ImageData} from "./image-data";

export interface AllergenData extends BaseModelData{
  name: string;
  description: string;
  image?: ImageData;
  status: AllergenStatus;
  other: Record<string, any>;

  translations: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }
}

export const AllergenStatuses = [`active`, `deleted`] as const;
export type AllergenStatus = typeof AllergenStatuses[number];