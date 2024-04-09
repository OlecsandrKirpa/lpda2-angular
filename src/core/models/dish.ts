import {BaseModel} from "@core/lib/base-model";
import {DishData, DishStatus} from "@core/lib/interfaces/dish-data";
import {Image} from "@core/models/image";
import { ImageData } from '@core/lib/interfaces/image-data';

export class Dish extends BaseModel {
  name?: string;
  description?: string;
  status?: DishStatus;
  price?: number;

  translations?: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }

  images?: Image[];
  suggestions?: Dish[];

  constructor(data: DishData) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.price = data.price;

    this.translations = data.translations;

    this.images = data.images ? data.images.map((image: ImageData) => new Image(image)) : [];
    this.suggestions = data.suggestions ? data.suggestions.map((dish: DishData) => new Dish(dish)) : [];
  }
}