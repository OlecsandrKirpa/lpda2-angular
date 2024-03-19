import {BaseModelData} from "@core/lib/interfaces/base-model-data";

export interface DishData extends BaseModelData {
  name?: string;
  description?: string;
  status?: DishStatus;
  price?: number;

  translations?: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }
}

export const DishStatuses = [`active`, `deleted`] as const;
export type DishStatus = typeof DishStatuses[number];