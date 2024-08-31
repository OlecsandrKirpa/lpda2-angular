import {BaseModel} from "@core/lib/base-model";
import {DishData, DishStatus} from "@core/lib/interfaces/dish-data";
import {Image} from "@core/models/image";
import { ImageData } from '@core/lib/interfaces/image-data';
import { Tag } from "./tag";
import { Allergen } from "./allergen";
import { Ingredient } from "./ingredient";
import { IngredientData } from "@core/lib/interfaces/ingredient-data";
import { AllergenData } from "@core/lib/interfaces/allergen-data";
import { TagData } from "@core/lib/interfaces/tag-data";

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
  tags?: Tag[];
  allergens?: Allergen[];
  ingredients?: Ingredient[];

  constructor(data: DishData) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.price = data.price;

    this.translations = data.translations;

    this.images = data.images ? data.images.map((image: ImageData) => new Image(image)) : [];
    this.suggestions = data.suggestions ? data.suggestions.map((dish: DishData) => new Dish(dish)) : [];
    this.tags = data.tags ? data.tags.map((tag: TagData) => new Tag(tag)) : [];
    this.allergens = data.allergens ? data.allergens.map((allergen: AllergenData) => new Allergen(allergen)) : [];
    this.ingredients = data.ingredients ? data.ingredients.map((ingredient: IngredientData) => new Ingredient(ingredient)) : [];
  }
}