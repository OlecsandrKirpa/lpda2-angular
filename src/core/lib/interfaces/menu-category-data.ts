import {BaseModelData} from "@core/lib/interfaces/base-model-data";
import {MenuVisibilityData} from "@core/lib/interfaces/menu-visibility-data";
import { ImageData } from '@core/lib/interfaces/image-data';

export interface MenuCategoryData extends BaseModelData {
  name?: string;
  description?: string;
  status?: MenuCategoryStatus;
  price?: number;
  parent_id?: number;
  index?: number;
  secret?: string;
  secret_desc?: string;
  visibility_id?: number;

  visibility?: MenuVisibilityData;
  parent?: MenuCategoryData;
  children?: MenuCategoryData[];

  images?: ImageData[];

  translations?: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }
}

export const MenuCategoryStatuses = [`active`, `deleted`] as const;
export type MenuCategoryStatus = typeof MenuCategoryStatuses[number];