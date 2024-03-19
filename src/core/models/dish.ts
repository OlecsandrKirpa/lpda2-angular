import {BaseModel} from "@core/lib/base-model";
import {DishData, DishStatus} from "@core/lib/interfaces/dish-data";

export class Dish extends BaseModel {
  name?: string;
  description?: string;
  status?: DishStatus;
  price?: number;

  translations?: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }

  constructor(data: DishData) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.price = data.price;

    this.translations = data.translations;
  }
}