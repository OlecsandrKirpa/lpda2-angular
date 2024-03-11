import {BaseModelData} from "@core/lib/interfaces/base-model-data";

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
}

export const ReservationStatuses = [`active`, `arrived`, `deleted`, `noshow`, `cancelled`] as const;
export type ReservationStatus = typeof ReservationStatuses[number];
