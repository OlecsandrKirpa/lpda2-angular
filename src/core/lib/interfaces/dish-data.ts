import {BaseModelData} from "@core/lib/interfaces/base-model-data";
import {Image} from "@core/models/image";
import { ImageData } from '@core/lib/interfaces/image-data';

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
}

export const DishStatuses = [`active`, `inactive`, `deleted`] as const;
export type DishStatus = typeof DishStatuses[number];