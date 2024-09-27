import {ReservationData, ReservationStatus} from "@core/lib/interfaces/reservation-data";
import {BaseModel} from "@core/lib/base-model";
import {DeliveredEmail} from "@core/models/delivered-email";
import {DeliveredEmailData} from "@core/lib/interfaces/delivered-email-data";
import { ReservationPaymentData, ReservationPaymentPreorderType, ReservationPaymentStatus } from "@core/lib/interfaces/reservation-payment-data";

export class ReservationPayment extends BaseModel {
  hpp_url?: string;
  value?: number;
  status?: ReservationPaymentStatus;
  reservation_id?: number;
  preorder_type?: ReservationPaymentPreorderType;
  other?: Record<string, unknown>;

  constructor(data: ReservationPaymentData) {
    super(data);

    this.hpp_url = data.hpp_url;
    this.value = data.value;
    this.status = data.status;
    this.reservation_id = data.reservation_id;
    this.preorder_type = data.preorder_type;
    this.other = data.other;
  }
}