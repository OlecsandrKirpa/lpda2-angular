import {BaseModel} from "@core/lib/base-model";
import {MenuVisibilityData} from "@core/lib/interfaces/menu-visibility-data";

export class MenuVisibility extends BaseModel {
  public_visible?: boolean;
  public_from?: Date;
  public_to?: Date;
  private_visible?: boolean;
  private_from?: Date;
  private_to?: Date;

  constructor(data: MenuVisibilityData) {
    super(data);

    this.public_visible = data.public_visible;
    this.public_from = data.public_from ? new Date(data.public_from) : undefined;
    this.public_to = data.public_to ? new Date(data.public_to) : undefined;
    this.private_visible = data.private_visible;
    this.private_from = data.private_from ? new Date(data.private_from) : undefined;
    this.private_to = data.private_to ? new Date(data.private_to) : undefined;
  }
}