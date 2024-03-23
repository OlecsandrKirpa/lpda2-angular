import {BaseModel} from "@core/lib/base-model";
import {MenuVisibilityData} from "@core/lib/interfaces/menu-visibility-data";

export class MenuVisibility extends BaseModel {
  // If you want to show this menu to the public, set public_visible to true.
  public_visible?: boolean;

  public_from?: Date;
  public_to?: Date;

  // If you want to make a menu visible only from a certain time to a certain time during the day,
  // you can use the daily_from and daily_to fields.
  daily_from?: Date;
  daily_to?: Date;

  // If you want to show this menu to a specific group of people, set private_visible to true.
  // Only people knowing the URL of the menu will be able to see it.
  private_visible?: boolean;

  constructor(data: MenuVisibilityData) {
    super(data);

    this.public_visible = data.public_visible;
    this.public_from = data.public_from ? new Date(data.public_from) : undefined;
    this.public_to = data.public_to ? new Date(data.public_to) : undefined;
    this.private_visible = data.private_visible;
    this.daily_from = data.daily_from ? new Date(data.daily_from) : undefined;
    this.daily_to = data.daily_to ? new Date(data.daily_to) : undefined;
  }
}