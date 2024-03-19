import {BaseModel} from "@core/lib/base-model";
import {MenuVisibility} from "@core/models/menu-visibility";
import {MenuCategoryData, MenuCategoryStatus} from "@core/lib/interfaces/menu-category-data";
import {Image} from "@core/models/image";

export class MenuCategory extends BaseModel {
  name?: string;
  description?: string;
  status?: MenuCategoryStatus;
  price?: number;
  parent_id?: number;
  index?: number;
  secret?: string;
  secret_desc?: string;
  menu_visibility_id?: number;

  menu_visibility?: MenuVisibility;
  parent?: MenuCategory;
  children?: MenuCategory[];

  images?: Image[];

  translations?: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  }

  constructor(data: MenuCategoryData) {
    super(data);


    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.price = data.price;
    this.parent_id = data.parent_id;
    this.index = data.index;
    this.secret = data.secret;
    this.secret_desc = data.secret_desc;
    this.menu_visibility_id = data.menu_visibility_id;

    this.menu_visibility = data.menu_visibility ? new MenuVisibility(data.menu_visibility) : undefined;
    this.parent = data.parent ? new MenuCategory(data.parent) : undefined;
    this.children = data.children ? data.children.map((category) => new MenuCategory(category)) : [];

    this.images = data.images ? data.images.map((image) => new Image(image)) : [];

    this.translations = data.translations;
  }
}