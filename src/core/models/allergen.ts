import {BaseModel} from "../lib/base-model";
import {AllergenData, AllergenStatus} from "../lib/interfaces/allergen-data";
import {Image} from "./image";

export class Allergen extends BaseModel {
  name: string;
  description: string;
  image?: Image;
  status: AllergenStatus;
  other: Record<string, any>;

  translations: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }

  constructor(data: AllergenData) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.other = data.other;
    this.translations = {...data.translations};

    if (data.image) this.image = new Image(data.image);
  }
}