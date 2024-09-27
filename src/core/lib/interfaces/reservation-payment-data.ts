import { BaseModelData } from "./base-model-data";

export interface ReservationPaymentData extends BaseModelData {
  hpp_url?: string;
  value?: number;
  status?: ReservationPaymentStatus;
  reservation_id?: number;
  preorder_type?: ReservationPaymentPreorderType;
  other?: Record<string, unknown>;
}

export const ReservationPaymentStatusOptions = ["todo", "paid"] as const;
export type ReservationPaymentStatus = typeof ReservationPaymentStatusOptions[number];

export const ReservationPaymentPreorderTypeOptions = ["nexi_payment"] as const;
export type ReservationPaymentPreorderType = typeof ReservationPaymentPreorderTypeOptions[number];