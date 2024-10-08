import { BaseModelData } from "./base-model-data";

export interface PreorderReservationGroupData extends BaseModelData {
  title?: string;
  status?: PreorderReservationGroupStatus;
  active_from?: string;
  active_to?: string;
  preorder_type?: PreorderType;
  payment_value?: number;
  message?: string;
}

export const PreorderReservationGroupStatuses = ["active", "inactive"] as const;
export type PreorderReservationGroupStatus = typeof PreorderReservationGroupStatuses[number];

export const PreorderTypes = ["nexi_payment"] as const;
export type PreorderType = typeof PreorderTypes[number];