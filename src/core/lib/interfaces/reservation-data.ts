import {BaseModelData} from "@core/lib/interfaces/base-model-data";
import {DeliveredEmailData} from "@core/lib/interfaces/delivered-email-data";
import { ReservationPaymentData } from "./reservation-payment-data";

export interface ReservationData extends BaseModelData {
  fullname?: string;
  datetime?: string;
  status?: ReservationStatus;
  secret?: string;
  adults?: number;
  children?: number;
  table?: string;
  notes?: string;
  email?: string;
  phone?: string;
  payment?: ReservationPaymentData;

  delivered_emails?: DeliveredEmailData[];
}

export const ReservationStatuses = [`active`, `arrived`, `deleted`, `noshow`, `cancelled`] as const;
export type ReservationStatus = typeof ReservationStatuses[number];

export const ReservationStatusTranslations: Record<ReservationStatus, { title: string }> = {
  active: {
    title: $localize`In attesa`
  },
  arrived: {
    title: $localize`Arrivato`
  },
  cancelled: {
    title: $localize`Annullato`
  },
  deleted: {
    title: $localize`Eliminato`
  },
  noshow: {
    title: $localize`No show`
  }
};

export function isReservationStatus(value: unknown): value is ReservationStatus {
  return typeof value === "string" && ([...ReservationStatuses] as string[]).includes(value);
}
