import {BaseModelData} from "@core/lib/interfaces/base-model-data";
import {DeliveredEmailData} from "@core/lib/interfaces/delivered-email-data";

export interface ReservationData extends BaseModelData {
  fullname?: string;
  datetime?: string;
  status?: ReservationStatus;
  secret?: string;
  people?: number;
  table?: string;
  notes?: string;
  email?: string;
  phone?: string;

  delivered_emails?: DeliveredEmailData[];
}

export const ReservationStatuses = [`active`, `arrived`, `deleted`, `noshow`, `cancelled`] as const;
export type ReservationStatus = typeof ReservationStatuses[number];
