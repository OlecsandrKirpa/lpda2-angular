import {BaseModelData} from "@core/lib/interfaces/base-model-data";
import {Image} from "@core/models/image";
import { ImageData } from '@core/lib/interfaces/image-data';
import { IngredientData } from "./ingredient-data";
import { TagData } from "./tag-data";
import { AllergenData } from "./allergen-data";

export interface DishData extends BaseModelData {
  name?: string;
  description?: string;
  status?: DishStatus;
  price?: number;

  translations?: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }

  images?: ImageData[];
  suggestions?: DishData[];
  tags?: TagData[];
  allergens?: AllergenData[];
  ingredients?: IngredientData[];
}

export const DishStatuses = [`active`, `inactive`, `deleted`] as const;
export type DishStatus = typeof DishStatuses[number];