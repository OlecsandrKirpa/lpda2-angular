import {BaseModel} from "../lib/base-model";
import {AllergenData, AllergenStatus} from "../lib/interfaces/allergen-data";
import {Image} from "./image";

export class Allergen extends BaseModel {
  name: string;
  description: string;
  image?: Image;
  status: AllergenStatus;
  other: Record<string, any>;

  constructor(data: AllergenData) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.other = data.other;

    if (data.image) this.image = new Image(data.image);
  }
}