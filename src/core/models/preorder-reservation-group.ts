import { BaseModel } from "@core/lib/base-model"
import { PreorderReservationGroupData, PreorderReservationGroupStatus, PreorderType } from "@core/lib/interfaces/preorder-reservation-group-data";

export class PreorderReservationGroup extends BaseModel {
  title?: string;
  status?: PreorderReservationGroupStatus;
  active_from?: Date;
  active_to?: Date;
  preorder_type?: PreorderType;
  payment_value?: number;
  message?: string;

  constructor(data: PreorderReservationGroupData) {
    super(data);

    this.title = data.title;
    this.status = data.status;
    this.active_from = data.active_from ? new Date(data.active_from) : undefined;
    this.active_to = data.active_to ? new Date(data.active_to) : undefined;
    this.preorder_type = data.preorder_type;
    this.payment_value = data.payment_value;
    this.message = data.message;
  }
}