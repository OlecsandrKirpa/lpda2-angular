import {BaseModelData} from "./base-model-data";
import {ImageData} from "./image-data";

export interface IngredientData extends BaseModelData {
  name: string;
  description: string;
  image?: ImageData;
  status: IngredientStatus;
  other: Record<string, any>;

  translations: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }
}

export const IngredientStatuses = [`active`, `deleted`] as const;
export type IngredientStatus = typeof IngredientStatuses[number];