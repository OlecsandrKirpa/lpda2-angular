import {BaseModelData} from "@core/lib/interfaces/base-model-data";

export interface MenuVisibilityData extends BaseModelData {
  public_visible?: boolean;
  public_from?: string;
  public_to?: string;
  private_visible?: boolean;
  private_from?: string;
  private_to?: string;
}