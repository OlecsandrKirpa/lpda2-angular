import {BaseModel} from "../lib/base-model";
import {AllergenData, AllergenStatus} from "../lib/interfaces/allergen-data";
import {Image} from "./image";
import {TagData, TagStatus} from "@core/lib/interfaces/tag-data";

export class Tag extends BaseModel {
  name: string;
  description: string;
  image?: Image;
  status: TagStatus;
  other: Record<string, any>;
  color: string;

  translations: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }

  constructor(data: TagData) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.other = data.other;
    this.translations = {...data.translations};
    this.color = data.color;

    if (data.image) this.image = new Image(data.image);
  }
}